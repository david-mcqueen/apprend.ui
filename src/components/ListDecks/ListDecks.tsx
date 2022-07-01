import { FC } from "react";
import ListItem from "./ListItem";

import './ListDecks.scss'

const ListDecks: FC = () => {

    const decks = ["sports", "communication"];

    return (
        <div className="list-decks">
            {decks.map((name: string) => {
                return <ListItem name={name} />
            })}
        </div>
    )
}

export default ListDecks;