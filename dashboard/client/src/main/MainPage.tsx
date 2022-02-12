import React from 'react';
import uuid from 'node-uuid';
import { Persona, Personas } from '../personas/Personas';
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
import Dialog from '../common/Dialog';
import './MainPage.sass';

const reactionCardWidth = 520;
const personaCardWidth = 630;
const gutter = 12;

const MainPage = (
    props: {
        personas: Personas,
        reactions: Reactions
    }
) => {
    React.useEffect(() => {
            PersonaActions.get();
            ReactionActions.get();
        },
        []
    );

    const personas = props.personas;
    const reactions = props.reactions;

    const [diagFields, setDiagFields] = React.useState({
        title: 'temp',
        body: <></>,
        onConfirm: () => {}
    });

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

    const removeReaction = (
        key: string,
        reaction: Reaction
    ) => {
        setDiagFields({
            title: 'Remove Reaction?',
            body:
            <div>
                <p>
                    Are you sure you want to remove <b></b>
                </p>
            </div>,
            onConfirm: () => ReactionActions.remove(key)
        });
    }

    const removePersona = (
        key: string,
        persona: Persona
    ) => {
        setDiagFields({
            title: 'Remove Persona?',
            body:
            <div>
                <p>
                    Are you sure you want to remove <b></b>
                </p>
            </div>,
            onConfirm: () => PersonaActions.remove(key)
        });
    }

    const existingNames = new Set([...personas].map(([_key, persona]) => persona.name));

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
                            set={
                                (reaction: Reaction) => {
                                    ReactionActions.put(uuid.v4(), reaction);
                                    setAddNewReaction(false);
                                }
                            }
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
                                        set={(reaction: Reaction) => props.setReaction(key, reaction)}
                                        remove={() => removeReaction(key, reaction)}
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
                            set={
                                (persona: Persona) => {
                                    PersonaActions.put(uuid.v4(), persona);
                                    setAddNewPersona(false);
                                }
                            }
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
                        [...personas].map(
                            (persona) =>
                                <PersonaReactions
                                    key={persona[0]}
                                    persona={persona}
                                    reactions={
                                        [...reactions]
                                            .filter(
                                                ([_rKey, reaction]) => reaction.persona === persona[0]
                                            )
                                    }
                                    setPersona={props.setPersona}
                                    removePersona={() => removePersona(...persona)}
                                    setReaction={props.setReaction}
                                    removeReaction={removeReaction}
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