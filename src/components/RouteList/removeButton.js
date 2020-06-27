import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { removePoint } from "../../redux/YMAP/actions";

const RemoveButton = ({ index, removePoint }) => {
    const handleClick = () => {
        removePoint(index);
    };

    return <button onClick={handleClick}>Удалить</button>;
};

const mapDispatchToProps = (dispatch) => {
    return {
        removePoint: (data) => dispatch(removePoint(data)),
    };
};

RemoveButton.propTypes = {
    removePoint: PropTypes.func.isRequired,
    index: PropTypes.number,
};
export default connect(null, mapDispatchToProps)(RemoveButton);
