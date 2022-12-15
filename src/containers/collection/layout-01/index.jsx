import React, { useEffect, useState } from "react";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
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
const SortableList = SortableContainer(({ gridcolumns, effect, collections }) => {
    return (
        <div className={gridcolumns ? `grid-container grid-${gridcolumns}-container` : "grid-container"}>
            {collections.map((collection, index) => (
                <SortableItem key={collection.id} index={index} collection={collection} effect={effect} />
            ))}
        </div>
    );
});

const CollectSortableExplorer = ({ gridcolumns, effect, collections }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (collections && collections.length > 0) {
            setItems(collections);
        }
    }, [collections]);

    // onSortEndHandler
    const onSortEndHandler = ({ oldIndex, newIndex }) => {
        setItems((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    return (
        <SortableList
            effect={effect}
            gridcolumns={gridcolumns}
            collections={items}
            onSortEnd={onSortEndHandler}
            axis="xy"
            helperClass="sortableHelperClass"
        />
    );
};

export default CollectSortableExplorer;
