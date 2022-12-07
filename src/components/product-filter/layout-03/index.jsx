import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";
import ContactWidget from "./contact";
import SortWidget from "./sort";
import CategoryFilter from "./category-filter";
import LevelFilter from "./level-filter";
import PriceSort from "./price-sort";
import PriceRangeFilter from "./price-range-filter";

const ProductFilter = ({
    sortHandler,
    filterHandler,
    priceHandler,
    inputs,
    sort,
    categories,
    levels,
}) => (
    <Scrollbars autoHide style={{ height: "100vh" }}
        renderThumbVertical={({ style, ...props }) =>
            <div {...props} className={'thumb-horizontal'} />
        }>
        <div className="nu-course-sidebar">
            <ContactWidget />
            <SortWidget onChange={sortHandler} value={sort} />
            <CategoryFilter categories={categories} onChange={filterHandler} />
            <LevelFilter onChange={filterHandler} levels={levels} />
            <PriceSort onChange={sortHandler} value={sort} />
            <PriceRangeFilter values={inputs.price} onChange={priceHandler} />
        </div>
    </Scrollbars>
);

ProductFilter.propTypes = {
    sortHandler: PropTypes.func,
    filterHandler: PropTypes.func,
    priceHandler: PropTypes.func,
    inputs: PropTypes.shape({
        price: PropTypes.arrayOf(PropTypes.number),
    }),
    sort: PropTypes.string,
    categories: PropTypes.shape({}),
    levels: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
};

export default ProductFilter;
