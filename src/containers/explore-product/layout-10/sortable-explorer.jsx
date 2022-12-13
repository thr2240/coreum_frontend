import React, { useState } from "react";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
import Product from "@components/product/layout-01";
import { useEffect } from "react";

const SortableItem = (({ item, effect }) => {
  return (
    <div className="grid-item">
      <Product
        overlay
        placeBid
        effect={effect}
        index={item.id}
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
const SortableList = SortableContainer(({ gridcolumns, effect, items }) => {
  return (
    <div className={gridcolumns ? `grid-container grid-${gridcolumns}-container` : "grid-container" }>
      {items.map((item, index) => (
        <SortableItem key={item.id} index={index} item={item} effect={effect} />
      ))}
    </div>
  );
});

const SortableExplorer = ({ gridcolumns, effect, products }) => {
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
      effect={effect}
      gridcolumns={gridcolumns}
      items={items}
      onSortEnd={onSortEndHandler}
      axis="xy"
      helperClass="sortableHelperClass"
    />
  );
};

export default SortableExplorer;
