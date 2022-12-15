import { useReducer, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Scrollbar } from "react-scrollbars-custom";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
import { StickyContainer, Sticky } from 'react-sticky';
import { SlClose } from 'react-icons/sl';
import { FiCheck } from 'react-icons/fi';
import SectionTitle from "@components/section-title/layout-02";
import ProductFilter from "@components/product-filter/layout-03";
import Product from "@components/product/layout-01";
import Pagination from "@components/pagination-02";
import AuthorProfileArea from "@containers/author-profile";
import { SectionTitleType, ProductType } from "@utils/types";
import { flatDeep } from "@utils/methods";
import { shuffleArray } from "@utils/methods";
import CollectionArea from "@containers/collection/layout-01";

import SortableExplorer from "./sortable-explorer";
import collectionsData from "../../../data/collections.json";
import { Image } from "react-bootstrap";

const GRID_COLUMN = {
  GRID_2: 2,
  GRID_3: 3,
  GRID_4: 4,
  GRID_5: 5
}

const NFT_EFFECT = {
  NO_EFFECT: 0,
  CARD_FLIP: 1,
  SPHERE_VIEW: 2
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUTS":
      return { ...state, inputs: { ...state.inputs, ...action.payload } };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_ALL_PRODUCTS":
      return { ...state, allProducts: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

const POSTS_PER_PAGE = 12;

const ExploreProductArea = ({
  className,
  space,
  data: { section_title, products, placeBid },
}) => {
  const itemsToFilter = [...products];
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    allProducts: products || [],
    inputs: { price: [0, 100] },
    sort: "newest",
    currentPage: 1,
  });
  const [gridcolumns, setGridColumns] = useState(GRID_COLUMN.GRID_4);
  const [walkThru, setWalkThru] = useState(false);
  const [effect, setEffect] = useState(NFT_EFFECT.CARD_FLIP);

  const onSaleProducts = shuffleArray(products).slice(0, 10);
  const ownedProducts = shuffleArray(products).slice(0, 10);
  const createdProducts = shuffleArray(products).slice(0, 10);
  const likedProducts = shuffleArray(products).slice(0, 10);

  /* Pagination logic start */
  const numberOfPages = Math.ceil(state.allProducts.length / POSTS_PER_PAGE);
  const paginationHandler = (page) => {
    dispatch({ type: "SET_PAGE", payload: page });
    const start = (page - 1) * POSTS_PER_PAGE;
    dispatch({
      type: "SET_PRODUCTS",
      payload: state.allProducts.slice(start, start + POSTS_PER_PAGE),
    });
    document
      .getElementById("explore-id")
      .scrollIntoView({ behavior: "smooth" });
  };
  /* Pagination logic end */

  /* Sorting logic start */
  const sortHandler = (value) => {
    dispatch({
      type: "SET_SORT",
      payload: value,
    });
    const sortedProducts = state.products.sort((a, b) => {
      switch (value) {
        case "most-liked":
          return a.likeCount < b.likeCount ? 1 : -1;
        case "least-liked":
          return a.likeCount > b.likeCount ? 1 : -1;
        case "oldest":
          return new Date(a.published_at).getTime() >
            new Date(b.published_at).getTime()
            ? 1
            : -1;
        case "low-to-high":
          return a.price.amount > b.price.amount ? 1 : -1;
        case "high-to-low":
          return a.price.amount > b.price.amount ? -1 : 1;
        default:
          return new Date(b.published_at).getTime() >
            new Date(a.published_at).getTime()
            ? 1
            : -1;
      }
    });
    dispatch({ type: "SET_PRODUCTS", payload: sortedProducts });
  };

  useEffect(() => {
    sortHandler(state.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage]);

  /* Sorting logic end */

  /* Filter logic start */

  // Pricing filter
  const priceHandler = (value) => {
    dispatch({ type: "SET_INPUTS", payload: { price: value } });
  };

  // Filter Handler, this function receives the filter name and the value
  const filterHandler = useCallback((name, val) => {
    dispatch({
      type: "SET_INPUTS",
      payload: { [name]: val },
    });
  }, []);

  // Filter Method, this function is responsible for filtering the products
  const filterMethods = (item, filterKey, value) => {
    if (value === "all") return false;
    const itemKey = filterKey;
    if (filterKey === "price") {
      return (
        item[itemKey].amount <= value[0] / 100 ||
        item[itemKey].amount >= value[1] / 100
      );
    }

    if (Array.isArray(value) && value.length === 0) return false;
    if (Array.isArray(item[itemKey])) {
      return !item[itemKey].some((a1) => value.includes(a1));
    }
    if (
      typeof item[itemKey] === "string" ||
      typeof item[itemKey] === "number"
    ) {
      return !value.includes(item[itemKey]);
    }
    return item[itemKey] !== value;
  };

  // Filter Method, this function is responsible for filtering the products
  const itemFilterHandler = useCallback(() => {
    let filteredItems = [];

    filteredItems = itemsToFilter.filter((item) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in state.inputs) {
        if (filterMethods(item, key, state.inputs[key])) return false;
      }
      return true;
    });
    dispatch({ type: "SET_ALL_PRODUCTS", payload: filteredItems });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inputs]);

  const handleColumns = useCallback((val) => {
    setGridColumns(val);
  }, []);

  const handleWalk = useCallback(() => {
    setWalkThru(true);
    document.body.classList.add('walk_mode');
  }, []);

  const handleEffect = useCallback((val) => {
    setEffect(val);
  }, []);

  const handleClose = useCallback(() => {
    setWalkThru(false);
    document.body.classList.remove('walk_mode');
  }, []);

  useEffect(() => {
    itemFilterHandler();
  }, [itemFilterHandler]);

  const initialRender = useRef(0);
  useEffect(() => {
    if (initialRender.current < 2) {
      initialRender.current += 1;
    } else {
      document
        .getElementById("explore-id")
        .scrollIntoView({ behavior: "smooth" });
    }
  }, [state.inputs]);

  useEffect(() => {
    dispatch({
      type: "SET_PRODUCTS",
      payload: state.allProducts.slice(0, 0 + POSTS_PER_PAGE),
    });
  }, [state.allProducts]);

  /* Filter logic end */

  // Generate data from products data
  const cats = flatDeep(products.map((prod) => prod.categories));
  const categories = cats.reduce((obj, b) => {
    const newObj = { ...obj };
    newObj[b] = obj[b] + 1 || 1;
    return newObj;
  }, {});
  const levels = [...new Set(products.map((prod) => prod.level))];

  return (
    <div
      className={clsx(
        "explore-area",
        space === 1 && "rn-section-gapTop",
        className
      )}
      id="explore-id"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            {section_title && (
              <SectionTitle disableAnimation {...section_title} />
            )}
          </div>
        </div>

        <div className="row g-5">
          <div className={clsx("rn-authore-profile-area", className)}>
            <TabContainer defaultActiveKey="nav-profile">
              <StickyContainer>
                <div className="container-fluid">
                  <div style={{ position: 'relative', zIndex: '99' }}>
                    <Sticky topOffset={-85}>
                      {({ style }) => {
                        return (
                          <div className="row author_header" style={{ ...style, top: '85px' }}>
                            <div className="col-12">
                              <div className="tab-wrapper-one">
                                <nav className="tab-button-one">
                                  <Nav
                                    className="nav nav-tabs"
                                    id="nav-tab"
                                    role="tablist"
                                  >
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-collections"
                                    >
                                      Collections
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-auction"
                                    >
                                      Auction
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-home"
                                    >
                                      On Sale
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-profile"
                                    >
                                      Owned
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-contact"
                                    >
                                      Created
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-liked"
                                    >
                                      Liked
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-activity"
                                    >
                                      Activity
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-games"
                                    >
                                      Games
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      eventKey="nav-comingsoon"
                                    >
                                      Coming Soon
                                    </Nav.Link>
                                    <Nav.Link
                                      as="button"
                                      className="more_options"
                                    >
                                      <span>More Options</span>
                                      <span className="premium_badge">
                                        <Image
                                          src="/images/icons/premium.png"
                                          alt="premuim"
                                          width={30}
                                          height={30}
                                        />
                                      </span>
                                      <div className="more_options_list">
                                        <ul>
                                          <li onClick={() => handleColumns(GRID_COLUMN.GRID_2)}>
                                            {gridcolumns === GRID_COLUMN.GRID_2 && <FiCheck />}
                                            <span>2 Columns</span>
                                          </li>
                                          <li onClick={() => handleColumns(GRID_COLUMN.GRID_3)}>
                                            {gridcolumns === GRID_COLUMN.GRID_3 && <FiCheck />}
                                            <span>3 Columns</span>
                                          </li>
                                          <li onClick={() => handleColumns(GRID_COLUMN.GRID_4)}>
                                            {gridcolumns === GRID_COLUMN.GRID_4 && <FiCheck />}
                                            <span>4 Columns</span>
                                          </li>
                                          <li onClick={() => handleColumns(GRID_COLUMN.GRID_5)}>
                                            {gridcolumns === GRID_COLUMN.GRID_5 && <FiCheck />}
                                            <span>5 Columns</span>
                                          </li>
                                          <hr className="mt--5 mb--5 mr--10 ml--10" />
                                          <li onClick={() => handleEffect(NFT_EFFECT.NO_EFFECT)}>
                                            {effect === NFT_EFFECT.NO_EFFECT && <FiCheck />}
                                            <span>No Effect</span>
                                          </li>
                                          <li onClick={() => handleEffect(NFT_EFFECT.CARD_FLIP)}>
                                            {effect === NFT_EFFECT.CARD_FLIP && <FiCheck />}
                                            <span>Card Flip</span>
                                          </li>
                                          <li onClick={() => handleEffect(NFT_EFFECT.SPHERE_VIEW)}>
                                            {effect === NFT_EFFECT.SPHERE_VIEW && <FiCheck />}
                                            <span>Sphere View</span>
                                          </li>
                                          <hr className="mt--5 mb--5 mr--10 ml--10" />
                                          <li onClick={handleWalk}>
                                            <span>Walk Through</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </Nav.Link>
                                  </Nav>
                                </nav>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Sticky>
                  </div>
                  <div className="author-explorer">
                    <ProductFilter
                      sortHandler={sortHandler}
                      inputs={state.inputs}
                      sort={state.sort}
                      categories={categories}
                      levels={levels}
                      filterHandler={filterHandler}
                      priceHandler={priceHandler}
                    />
                    <div className="author-container">
                      <Scrollbar autoHide style={{ height: "100vh" }}>
                        <TabContent className="tab-content rn-bid-content">
                          <TabPane className="row d-flex g-5 w-100 ml--0 mr--0" eventKey="nav-auction">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={onSaleProducts} />
                          </TabPane>
                          <TabPane className="row d-flex g-5 w-100 ml--0 mr--0" eventKey="nav-home">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={onSaleProducts} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-profile">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={ownedProducts} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-contact">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={createdProducts} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-liked">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={likedProducts} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-collections">
                            <CollectionArea gridcolumns={gridcolumns} collections={collectionsData} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-activity">
                            <SortableExplorer gridcolumns={gridcolumns} effect={effect} products={likedProducts} />
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-games">
                          </TabPane>
                          <TabPane className="row g-5 d-flex w-100 ml--0 mr--0" eventKey="nav-comingsoon">
                          </TabPane>
                        </TabContent>
                      </Scrollbar>
                    </div>
                  </div>
                </div>
              </StickyContainer>

            </TabContainer>
            {walkThru && (
              <div className="walk_thru_container">
                <iframe
                  title="Walk Through"
                  src={'http://95.216.85.81:9966'}
                  className="walk_thru"
                ></iframe>
                <div className="walk_close" onClick={handleClose}>
                  <SlClose size="40px" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ExploreProductArea.propTypes = {
  className: PropTypes.string,
  space: PropTypes.oneOf([1, 2]),
  data: PropTypes.shape({
    section_title: SectionTitleType,
    products: PropTypes.arrayOf(ProductType),
    placeBid: PropTypes.bool,
  }),
};

ExploreProductArea.defaultProps = {
  space: 1,
};

export default ExploreProductArea;
