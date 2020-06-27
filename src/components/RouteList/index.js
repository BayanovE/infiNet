import React from "react";
import PropTypes from "prop-types";
import Sortable from "sortablejs";
import { connect } from "react-redux";

import { getState as getPoints } from "../../redux/YMAP/selectors";
import { swapPoints } from "../../redux/YMAP/actions";
import RemoveButton from "./removeButton";

class RouteList extends React.Component {
    constructor(props) {
        super(props);

        this.container = React.createRef();
    }

    componentDidMount() {
        Sortable.create(this.container.current, { onSort: this.handleSort });
    }

    handleSort = (e) => {
        this.props.swapPoints(e.oldIndex, e.newIndex);
    };

    render() {
        const { points } = this.props;
        return (
            <div className="route-list-container" ref={this.container}>
                {points.map(({ address, coords }, index) => (
                    <div
                        className="route-list-item"
                        key={`route-list-item-${index}`}
                    >
                        <div className="route-list-item__data">
                            {address ? address : coords}
                        </div>
                        <div className="route-list-item__controls">
                            <RemoveButton index={parseInt(index)} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        points: getPoints(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        swapPoints: (a, b) => dispatch(swapPoints(a, b)),
    };
};

RouteList.defaultProps = {
    points: [],
};

RouteList.propTypes = {
    points: PropTypes.array,
    swapPoints: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteList);
