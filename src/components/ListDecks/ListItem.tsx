import { FC } from "react";
import { Link } from "react-router-dom";

import './ListItem.scss'

type ListItemProps = {
    name: string
}

const ListItem: FC<ListItemProps> = ({name}) => {


    return (
        <Link to={`deck/${name}`}>{name}</Link>
    )
}

export default ListItem;