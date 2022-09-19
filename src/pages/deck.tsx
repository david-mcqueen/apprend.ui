
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withAuth } from "../auth/withAuth";
import { Element, getDeck } from '../data/queries'
import './deck.scss';

const Deck = () => {

    const [verbs, setVerbs] = useState<Element[]>();
    const {deck} = useParams();

    const getDeckWords = async (deck: string) => {
      const words = await getDeck(deck);
      setVerbs(words);
    }
  
  useEffect(() => {
      if (deck){
        getDeckWords(deck)
      }
    }, [deck]);

    return (
      <div className="deck">
        {verbs?.map((word: Element, i: number) => (
          <div key={i}>
            <h1>{word.element}</h1>
            <h2>{word.translation}</h2>
            <h2>{word.group}</h2>
          </div>
        ))}
      </div>
    )
}

export default withAuth(Deck);