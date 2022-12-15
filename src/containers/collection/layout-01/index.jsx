import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Collection from "@components/collection";

const SortableItem = (({ collection, effect }) => {
    return (
        <div className="grid-item">
            <div className="product-card">
                <Collection
                    title={collection.title}
                    total_item={collection.total_item}
                    path={collection.slug}
                    image={collection.image}
                    thumbnails={collection.thumbnails}
                    profile_image={collection.profile_image}
                />
            </div>
        </div >
    );
});
const SortableList = (({ gridcolumns, effect, collections, setItems }) => {
    return (
        <ReactSortable
            className={gridcolumns ? `grid-container grid-${gridcolumns}-container` : "grid-container"}
            list={collections}
            setList={setItems}
            delayOnTouchOnly={true}
            animation={200}
            delay={2}
        >
            {collections.map((collection, index) => (
                <SortableItem key={collection.id} index={index} collection={collection} effect={effect} />
            ))}
        </ReactSortable>
    );
});

const CollectSortableExplorer = ({ gridcolumns, effect, collections }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (collections && collections.length > 0) {
            setItems(collections);
        }
    }, [collections]);

    return (
        <SortableList
            effect={effect}
            gridcolumns={gridcolumns}
            collections={items}
            setItems={setItems}
        />
    );
};

export default CollectSortableExplorer;
