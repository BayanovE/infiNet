import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addPoint } from "../../redux/YMAP/actions";

class YSuggest extends React.Component {
    constructor(props) {
        super(props);

        this.suggest = null;
    }

    componentDidMount() {
        this.init();
    }

    handleSelect = async (event) => {
        const address = (event.get(`item`).value || ``).trim();
        const coords = await this.getCoords(address);

        this.props.addPoint({ address, coords });
    };

    getCoords = async (address) => {
        if (!window.ymaps) {
            return;
        }
        let coords = null;

        try {
            await window.ymaps.geocode(address).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                coords = firstGeoObject.geometry.getCoordinates();
            });
        } catch (e) {
            alert(`ymaps failed on geocode: ${e}`);
        }

        return coords;
    };

    init = () => {
        if (!window.ymaps) {
            return;
        }

        const { id, center } = this.props;

        window.ymaps.ready(() => {
            const boundedBy = [
                [center[0] + 1, center[1] - 1],
                [center[0] - 1, center[1] + 1],
            ];
            this.suggest = new window.ymaps.SuggestView(id, { boundedBy });
            this.suggest.events.add(`select`, this.handleSelect);
        });
    };

    render() {
        const { id } = this.props;
        return <input type="text" id={id} className="y-suggest" />;
    }
}

YSuggest.defaultProps = {
    id: "suggest",
    center: [56.838011, 60.597465],
};

YSuggest.propTypes = {
    id: PropTypes.string,
    addPoint: PropTypes.func.isRequired,
    center: PropTypes.array,
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPoint: (data) => dispatch(addPoint(data)),
    };
};

export default connect(null, mapDispatchToProps)(YSuggest);
