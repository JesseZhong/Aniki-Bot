import React from 'react';
import { Personas } from '../personas/Personas';
import { Reaction, Reactions } from '../reactions/Reactions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StackGrid, { Grid } from 'react-stack-grid';
import PersonaReactions from '../personas/PersonaReactions';
import ReactionCard from '../reactions/ReactionCard';
import ReactionCardEdit from '../reactions/ReactionCardEdit';
import PersonaCreate from '../personas/PersonaCreate';
import PersonaActions from '../actions/PersonaActions';
import ReactionActions from '../actions/ReactionActions';
import compact from 'lodash/compact';
import { Guild } from '../guild/Guild';
import './MainPage.sass';


const reactionCardWidth = 520;
const personaCardWidth = 630;
const gutter = 12;

const MainPage = (
    props: {
        guild: Guild,
        personas: Personas,
        reactions: Reactions
    }
) => {
    React.useEffect(() => {
            PersonaActions.get();
            ReactionActions.get();
        },
        [props.guild]
    );

    const personas = props.personas;
    const reactions = props.reactions;

    const pageRef = React.createRef<HTMLDivElement>();

    const [reactionGridRef, setReactionGridRef] = React.useState<Grid | undefined>(undefined);
    const [personaGridRef, setPersonaGridRef] = React.useState<Grid | undefined>(undefined);
    const [reactionCols, setReactionCols] = React.useState(0);
    const [personaCols, setPersonaCols] = React.useState(0);
    const [addNewReaction, setAddNewReaction] = React.useState(false);
    const [addNewPersona, setAddNewPersona] = React.useState(false);

    React.useLayoutEffect(
        () => {
            const calcCols = () => {
                if (pageRef.current) {
                    const pageWidth = pageRef.current.offsetWidth || 0;
                    setReactionCols(Math.floor(pageWidth / reactionCardWidth));
                    setPersonaCols(Math.floor(pageWidth / personaCardWidth));
                }
            }

            // Run on first render.
            calcCols();
    
            window.addEventListener(
                'resize',
                calcCols
            );

            return () => {
                window.addEventListener(
                    'resize',
                    calcCols
                )
            }
        },
        [pageRef]
    );

    if (!personas.size && !reactions.size) {
        return (
            <div
                className='d-flex justify-content-center align-items-center'
                style={{
                    height: '100vh'
                }}
            >
                <img
                    src='https://i.imgur.com/KTnfQcq.gif'
                    alt='Loading my dudes~'
                />
            </div>
        )
    }

    const existingNames = new Set(compact([...personas.values()].map((persona) => persona.name)));

    return (
        <div
            ref={pageRef}
            className='main-page'
        >
            <div className='d-flex flex-row justify-content-between'>
                <h1>
                    Reactions
                </h1>
                <div className='align-self-center'>
                    <button
                        type='button'
                        className='btn btn-outline-white text-primary'
                        onClick={() => setAddNewReaction(!addNewReaction)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Reaction
                    </button>
                </div>
            </div>
            <div className='mb-5'>
                {
                    addNewReaction &&
                    <div
                        className='reaction-add my-3 mx-auto'
                        style={{
                            maxWidth: `${reactionCols * reactionCardWidth + ((reactionCols - 1) * gutter)}px`
                        }}
                    >
                        <ReactionCardEdit
                            finishedEdit={() => setAddNewReaction(false)}
                        />
                    </div>
                }
                <StackGrid
                    columnWidth={reactionCardWidth}
                    gutterWidth={gutter}
                    gutterHeight={gutter}
                    gridRef={grid => setReactionGridRef(grid)}
                >
                    {
                        reactions &&
                        [...reactions]
                            .filter(
                                ([_key, reaction]) => !reaction.persona
                            )
                            .map(
                                ([key, reaction]) =>
                                    <ReactionCard
                                        key={key}
                                        reaction={reaction}
                                        onResize={() => reactionGridRef?.updateLayout()}
                                    />
                            )
                    }
                </StackGrid>
            </div>
            <div className='d-flex flex-row justify-content-between'>
                <h2>Bot Personas</h2>
                <div className='align-self-center'>
                    <button
                        type='button'
                        className='btn btn-outline-white text-primary'
                        onClick={() => setAddNewPersona(!addNewPersona)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Persona
                    </button>
                </div>
            </div>
            <div>
                {
                    addNewPersona &&
                    <div
                        className='my-3 mx-auto'
                        style={{
                            maxWidth: `${personaCols * personaCardWidth + ((personaCols - 1) * gutter)}px`
                        }}
                    >
                        <PersonaCreate
                            finishedEdit={() => setAddNewPersona(false)}
                            existingNames={existingNames}
                        />
                    </div>
                }
                <StackGrid
                    columnWidth={personaCardWidth}
                    gutterWidth={gutter}
                    gutterHeight={gutter}
                    gridRef={grid => setPersonaGridRef(grid)}
                >
                    {
                        personas &&
                        [...personas.values()].map(
                            (persona) =>
                                <PersonaReactions
                                    key={persona.id}
                                    persona={persona}
                                    reactions={
                                        [...reactions.values()].filter(
                                            (reaction: Reaction) => reaction.persona === persona.id
                                        )
                                    }
                                    onResize={() => personaGridRef?.updateLayout()}
                                />
                        )
                    }
                </StackGrid>
            </div>
        </div>
    )
}


export default MainPage;