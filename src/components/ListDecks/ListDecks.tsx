import { FC, useEffect, useState } from "react";
import ListItem from "./ListItem";

import './ListDecks.scss'
import { Deck, getDecks } from "../../data/queries";

const ListDecks: FC = () => {

    const [decks, setDecks] = useState<Deck[]>();
    
    const getAvailableDecks = async () => {
        const decks = await getDecks();
        setDecks(decks);
    }

    useEffect(() => {
        getAvailableDecks();
      }, []);

    return (
        <div className="list-decks">
            {decks?.map((d: Deck, i: number) => {
                return <ListItem name={d.deck} key={i}/>
            })}
        </div>
    )
}

export default ListDecks;