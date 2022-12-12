import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import { TbHeart, TbMessageCircle2, TbBrandTelegram, TbCheck } from 'react-icons/tb';
import CardFlip from 'react-card-flip';
import Anchor from "@ui/anchor";
import CountdownTimer from "@ui/countdown/layout-01";
import ShareDropdown from "@components/share-dropdown";
import ProductBid from "@components/product-bid";
import ClientAvatar from "@ui/client-avatar";
import Button from "@ui/button";
import { ImageType } from "@utils/types";
import PlaceBidModal from "@components/modals/placebid-modal";
import Comment from "./comment";

const NFT_EFFECT = {
    CARD_FLIP: 0,
    SPHERE_VIEW: 1
}

const Product = ({
    overlay,
    title,
    slug,
    index,
    effect,
    latestBid,
    price,
    likeCount,
    auction_date,
    image,
    bitCount,
    authors,
    placeBid,
    disableShareDropdown = true,
}) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [comment, setComment] = useState(false);
    const [isFlipped, setFlipped] = useState(false);

    const handleBidModal = () => {
        setShowBidModal((prev) => !prev);
    };
    const handleFavorite = () => {
        setFavorite((prev) => !prev);
    }

    return (
        <div className="position-relative">
            <Anchor path={`/product/${slug}`}>
                <div className={clsx("card-flip-board", isFlipped && "card-flip-back-board")}
                    onMouseOver={() => setFlipped(true)}
                    onMouseLeave={() => setFlipped(false)}
                ></div>
            </Anchor>
            <CardFlip isFlipped={isFlipped}>
                <div
                    className={clsx(
                        "product-style-one",
                        !overlay && "no-overlay",
                        placeBid && "with-placeBid"
                    )}
                >
                    <div className="card-thumbnail">
                        {image?.src && (
                            <Image
                                src={image.src}
                                alt={image?.alt || "NFT_portfolio"}
                                width={533}
                                height={533}
                            />
                        )}
                        <span className="product_temp_number">{index}</span>
                    </div>
                    <div className="product-share-wrapper">
                        <div className="profile-share">
                            <div className="profile-share-item" onClick={handleFavorite} >
                                {favorite ?
                                    <TbCheck size="25px" />
                                    : <TbHeart size="25px" />
                                }
                            </div>
                            <div className="profile-share-item">
                                <TbMessageCircle2 size="25px" onClick={() => setComment(true)} />
                                <Comment show={comment} authors={authors} />
                            </div>
                            <div className="profile-share-item">
                                <TbBrandTelegram size="25px" />
                            </div>
                        </div>
                        {auction_date && <div className="auction_star"></div>}
                    </div>
                </div>
                <div
                    className={clsx(
                        "product-style-one",
                        "product-style-back"
                    )}
                >
                    <div className="card-thumbnail-back"></div>
                    <div className="product-share-wrapper">
                        <Anchor path={`/product/${slug}`}>
                            <span className="product-name">{title}</span>
                        </Anchor>
                        <span className="latest-bid">Highest bid {latestBid}</span>
                        <ProductBid price={price} likeCount={likeCount} />
                        {auction_date && <CountdownTimer date={auction_date} />}
                        <div className="profile-share">
                            {authors?.map((client) => (
                                <ClientAvatar
                                    key={client.name}
                                    slug={client.slug}
                                    name={client.name}
                                    image={client.image}
                                />
                            ))}
                            <Anchor
                                className="more-author-text"
                                path={`/product/${slug}`}
                            >
                                {bitCount}+ Place Bit.
                            </Anchor>
                        </div>
                        {placeBid && (
                            <Button onClick={handleBidModal} size="small">
                                Place Bid
                            </Button>
                        )}
                    </div>

                </div>
            </CardFlip>
            <PlaceBidModal show={showBidModal} handleModal={handleBidModal} />
        </div>
    );
};

Product.propTypes = {
    overlay: PropTypes.bool,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    latestBid: PropTypes.string.isRequired,
    price: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
    }).isRequired,
    likeCount: PropTypes.number.isRequired,
    auction_date: PropTypes.string,
    image: ImageType.isRequired,
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            image: ImageType.isRequired,
        })
    ),
    bitCount: PropTypes.number,
    placeBid: PropTypes.bool,
    disableShareDropdown: PropTypes.bool,
};

Product.defaultProps = {
    overlay: false,
};

export default Product;
