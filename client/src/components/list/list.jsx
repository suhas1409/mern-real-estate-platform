//component/list/list.jsx
import React from "react";
import "./list.scss";
import { Card } from "../card/Card";

export const List = ({posts, onRemoveSaved, isOwner = false, onDelete}) => {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          onRemoveSaved={onRemoveSaved}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};