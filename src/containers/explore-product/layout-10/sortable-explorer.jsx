import React, { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import Product from "@components/product/layout-01";
import { useEffect } from "react";

const SortableItem = SortableElement(({ item }) => {
  return (
    <div className="grid-item">
      <Product
        overlay
        placeBid
        title={item.title}
        slug={item.slug}
        latestBid={item.latestBid}
        price={item.price}
        likeCount={item.likeCount}
        auction_date={item.auction_date}
        image={item.images?.[0]}
        authors={item.authors}
        bitCount={item.bitCount}
      />
    </div >
  );
});
const SortableList = SortableContainer(({ items }) => {
  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <SortableItem key={item.id} index={index} item={item} />
      ))}
    </div>
  );
});

const SortableExplorer = ({ products }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setItems(products);
    }
  }, [products]);

  // onSortEndHandler
  const onSortEndHandler = ({ oldIndex, newIndex }) => {
    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <SortableList
      items={items}
      onSortEnd={onSortEndHandler}
      axis="xy"
      helperClass="sortableHelperClass"
    />
  );
};

export default SortableExplorer;
