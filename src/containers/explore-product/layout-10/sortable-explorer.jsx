import React, { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import Product from "@components/product/layout-01";

const MIN_WIDTH = 15;
const MAX_WIDTH = 30;
const STEP_WIDTH = 0.15;

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
const SortableList = (({ gridcolumns, effect, view, items, setItems }) => {
  const rate = MAX_WIDTH - view * STEP_WIDTH;
  return (
    <ReactSortable 
      // className={gridcolumns ? `grid-container grid-${gridcolumns}-container` : "grid-container" } 
      className="grid-container"
      list={items} 
      setList={setItems}
      delayOnTouchOnly={true}
      animation={200}
      delay={2}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${rate}%, 1fr))`}}
    >
      {items.map((item, index) => (
        <SortableItem key={item.id} index={index} item={item} effect={effect} />
      ))}
    </ReactSortable>
  );
});

const SortableExplorer = ({ gridcolumns, view, effect, products }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (products.length > 0) {
      setItems(products);
    }
  }, [products]);

  return (
    <SortableList
      effect={effect}
      gridcolumns={gridcolumns}
      view={view}
      items={items}
      setItems={setItems}      
    />
  );
};

export default SortableExplorer;
