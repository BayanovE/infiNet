import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addPoint, editPoint } from "../../redux/YMAP/actions";
import { getState as getPoints } from "../../redux/YMAP/selectors";

/*
 * Небольшая ремарка: по хорошему - надо бы сделать некий "промежуточный слой", который бы вместо того, чтобы стирать
 * и зановов перерисовывать все объекты на карте - смотрел бы, что действительно поменялось и только это бы менял, но
 * мне кажется, что это не стоит времени. в данном случае
 * */

class Ymap extends React.Component {
    constructor(props) {
        super(props);

        this.map = null;
    }

    componentDidMount() {
        this.initMap();
    }

    componentWillUnmount() {
        if (this.map) {
            this.map.destroy();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.renderObjects();
    }

    renderObjects = () => {
        if (!window.ymaps) {
            return;
        }

        this.map.geoObjects.removeAll();

        this.renderPlacemarks();
        this.renderRoute();
    };

    renderPlacemarks = () => {
        const { points } = this.props;
        points.forEach(({ coords }, index) => {
            const placeMark = this.createPlacemark(coords);
            placeMark.events.add(
                "dragend",
                this.handlePlaceMarkDragEnd(index, placeMark)
            );
            this.map.geoObjects.add(placeMark);
        });
    };

    renderRoute = () => {
        const { points } = this.props;
        const poliline = this.createPoliline(
            points.map(({ coords }) => coords)
        );
        this.map.geoObjects.add(poliline);
    };

    createPoliline = (arrayOfCoords = []) =>
        new window.ymaps.Polyline(
            arrayOfCoords,
            {
                balloonContent: "Ломаная линия",
            },
            {
                strokeColor: "#000000",
                strokeWidth: 4,
                strokeOpacity: 0.5,
            }
        );

    createPlacemark = (coords) =>
        new window.ymaps.Placemark(
            coords,
            {},
            {
                preset: "islands#violetDotIconWithCaption",
                draggable: true,
            }
        );

    getAddress = async (coords) => {
        if (!window.ymaps) {
            return;
        }
        let address = null;

        try {
            await window.ymaps.geocode(coords).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                address = firstGeoObject.getAddressLine();
            });
        } catch (e) {
            alert(`ymaps failed on reverse geocode: ${e}`);
        }

        return address;
    };

    initMap() {
        if (!window.ymaps) {
            return;
        }

        window.ymaps.ready(() => {
            this.map = new window.ymaps.Map(this.props.id, {
                center: this.props.center,
                zoom: this.props.zoom,
                controls: this.props.controls,
            });
            this.map.events.add("click", this.handlePlaceMarkClick);
        });
    }

    handlePlaceMarkDragEnd = (index, placeMark) => async () => {
        const coords = placeMark.geometry.getCoordinates();
        const address = await this.getAddress(coords);
        this.props.editPoint(index, { coords, address });
    };

    handlePlaceMarkClick = async (e) => {
        const coords = e.get("coords");
        const address = await this.getAddress(coords);
        this.props.addPoint({ coords, address });
    };

    render() {
        return (
            <div
                id={this.props.id}
                className="map"
                style={{
                    width: this.props.width,
                    height: this.props.height,
                }}
            />
        );
    }
}

Ymap.defaultProps = {
    id: `map`,
    width: `100%`,
    height: undefined,
    center: [56.838011, 60.597465],
    zoom: 12,
    controls: ["zoomControl"],
    points: [],
};

Ymap.propTypes = {
    id: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    addPoint: PropTypes.func.isRequired,
    editPoint: PropTypes.func.isRequired,
    points: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        points: getPoints(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPoint: (data) => dispatch(addPoint(data)),
        editPoint: (index, data) => dispatch(editPoint(index, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ymap);
