// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CloudFrontAllowedMethods, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';

export class SsrStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const domain = process.env.SITE_URL;
    if (!domain) {
      throw new Error('Site URL undefined.');
    }

    // Create a bucket to store the static version of the site.
    const siteBucket = new s3.Bucket(
      this,
      'site',
      {
        bucketName: domain,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'error.html',
        publicReadAccess: false
      }
    );
    new cdk.CfnOutput(
      this,
      'Bucket',
      { value: siteBucket.bucketName }
    );

    // User OAI to restrict access to CloudFront distribution.
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'site-oai'
    );
    siteBucket.grantRead(originAccessIdentity);

    // Deploy the site to the bucket.
    new s3deploy.BucketDeployment(
      this,
      'Compiled static site/client to be served through S3.',
      {
        sources: [s3deploy.Source.asset('../client/build/')],
        destinationBucket: siteBucket
      }
    );

    // Lookup an existing hosted zone for the specified domain.
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      'hosted-zone',
      {
        domainName: domain.replace(
          /^(.*\.|)(?<domain>[^\/]*\..{2,5})$/i,
          '$<domain>'
        )
      }
    );

    // Create a certificate (and validate) if one doesn't exist.
    const certificate = new acm.Certificate(
      this,
      'certificate',
      {
        domainName: domain,
        validation: acm.CertificateValidation.fromDns(hostedZone)
      }
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'site-cdn',
      {
        // Max allowed HTTP.
        httpVersion: cloudfront.HttpVersion.HTTP2,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

        // Cheapest. Only serving USA, Canada, Europe, & Israel.
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

        // Setup custom domain along with certificate.
        // Also, enforce 1.2 minimum.
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            aliases: [
              domain
            ]
          }
        ),

        originConfigs: [
          {
            // Make site bucket the origin,
            // allowing access via OAI.
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: originAccessIdentity
            },
            
            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD,

                // Enforce HTTPS.
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

                // Make sure to forward User-Agent for
                // Lambda@Edge to distinguish between user and bot.
                forwardedValues: {
                  headers: [
                    'User-Agent'
                  ],
                  queryString: false
                }
              }
            ]
          }
        ],

        // Forward non-root routes to client to handle, instead
        // of being rejected by S3 as a non-existent object path.
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: '/index.html',
            responseCode: 200,
            errorCachingMinTtl: 300
          },
          {
            errorCode: 404,
            responsePagePath: '/index.html',
            responseCode: 200,
            errorCachingMinTtl: 300
          }
        ]
      }
    );

    new cdk.CfnOutput(this, 'CloudFront URL', {
      value: `https://${distribution.distributionDomainName}`
    });
  }
}