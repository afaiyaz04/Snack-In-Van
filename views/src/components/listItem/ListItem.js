// List item reusable component used to display items as a list
import React from "react";
import { useSelector } from "react-redux";
//redux
import { getLineItems } from "../../redux/Order/order.selectors";
import { IMAGE_SRC, SLASH } from "../../app/urlConfig";
//app
import { roundNum, getQuantityInOrder } from "../../app/helperFunctions";

function ListItem(props) {
	const id = props.item._id;
	const lineItems = useSelector(getLineItems); // get the items to be displayed
	const photoString = IMAGE_SRC + SLASH + props.item.photo;
	const name = props.item.name; // item name
	const roundedPrice = roundNum(props.item.price, 2);
	const description = props.item.description; // item description
	const quantityInOrder = getQuantityInOrder(id, lineItems);

	return (
		<div className="list-item flex-row">
			<img className="list-item__image" src={photoString} alt="" />
			<div className="list-item__mid padding">
				<div className="list-item__name subheading">{name}</div>
				<div className="normaltext">{description}</div>
			</div>
			<div className="list-item__right flex-row">
				<div className="list-item__price normaltext">
					{roundedPrice}
					<QuantityBubble value={quantityInOrder} />
				</div>
			</div>
		</div>
	);
}
export default ListItem;

// FUNCTIONAL COMPONENTS
// Used to display the number of items selected
function QuantityBubble(props) {
	// if there are items of this type in order: render
	if (props.value) {
		return (
			<div className="qty-bubble">
				<div className="qty-bubble__value">{props.value}</div>
			</div>
		);
	} else {
		return null;
	}
}
