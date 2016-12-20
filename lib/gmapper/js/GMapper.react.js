(function() {
  'use strict';

  const _              = require('underscore');
  const React          = require('react');
  const ReactDOM       = require('react-dom');
  const ReactDOMServer = require('react-dom/server');
  const async          = require('./async.js');

  /**
   * @module GoogleMapper
   */
  const GoogleMapper = React.createClass({
    propTypes: {
      center: React.PropTypes.object.isRequired,
      apiKey: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
      return {
        userLocation: {},
        nearbyLocations: this.props.locations || []
      };
    },

    componentDidMount: function() {
      async.load(
        'https://maps.google.com/maps/api/js?key=' + this.props.apiKey + '&v=3&libraries=places!callback',
        this._googleMapApiCallback
      );
    },

    /**
     * The callback for the Google Map async request. This
     * fetches the nearby locations from Parse, resets the state,
     * and then adds the markers to the Google Map.
     */
    _googleMapApiCallback: function() {
      this.setState({
        userLocation: this.props.center
      });
      this._drawGoogleMap();
    },

    /**
     * Generates a Google Map LatLng object.
     */
    _genGoogleMapLatLng: function(markerData) {
      return markerData ? new google.maps.LatLng(markerData.latitude, markerData.longitude) : null;
    },

    /**
     * Helper functional to make rendering Google Map markers easier
     */
    _makeMapListener: function(window, map, content, marker) {
      return function() {
        window.setContent(content);
        window.open(map, this);
      };
    },

    /**
     * Begins rendering of Javascript version of Google Map
     */
    _drawGoogleMap: function() {
      const mapOptions = {
        center: this._genGoogleMapLatLng(this.state.userLocation),
        zoom: this.props.zoom,
        mapTypeId: this.props.mapType || google.maps.MapTypeId.ROADMAP,
        styles: this.props.styles,
        scrollwheel: this.props.scrollwheel,
        mapTypeControlOptions: {
          mapTypeIds: [(this.props.mapType || google.maps.MapTypeId.ROADMAP), 'map_style']
        }
      };
      const gMap = new google.maps.Map(this.refs.map, mapOptions);
      const infowindow = new google.maps.InfoWindow({
        maxWidth: 300
      });
      this._addLocations(gMap, infowindow);
    },

    _addLocations: function(gMap, infowindow) {
      var tooltip;
      _.each(this.state.nearbyLocations, function(loc) {
        if (loc.googlePlacesReference) {
          this._getGoogleDetails(loc.googlePlacesReference, gMap, function(place, data) {
            place.google = data;
            this._addGoogleMapTooltip(gMap, place, this.tooltip(place), infowindow);
          }.bind(this, loc));
        } else {
          this._addGoogleMapTooltip(gMap, loc, this.tooltip(loc), infowindow);
        }
      }.bind(this));
    },

    /**
     * Adds the icons and details (generated by clicks) 
     * close to the users current location.
     */
    _addGoogleMapTooltip: function(gMap, loc, tooltipContent, infowindow) {
      loc.location = loc.latLng;
      const markerOpts   = {
        position: this._genGoogleMapLatLng(loc.location),
        location: loc.location,
        title: loc.channelName,
        animation: google.maps.Animation.DROP,
        map: gMap,
        url: loc.url
      };

      if (loc.icon) {
        markerOpts.icon = {
          url: loc.icon || 'img/small-record.png',
          anchor: new google.maps.Point(20, 20),
        };

        if (loc.size) {
          markerOpts.icon.size = new google.maps.Size(40, 40);
        }
      }

      if (loc.googlePlacesReference) {
        markerOpts.place = {
          placeId: loc.googlePlacesReference,
          location: {
            lat: loc.location.latitude,
            lng: loc.location.longitude
          }
        };
        markerOpts.attribution = {
          source: loc.title,
          webUrl: loc.url
        };
      }

      const marker = new google.maps.Marker(markerOpts);

      google.maps.event.addListener(
        marker,
        'click',
        this._makeMapListener(infowindow, gMap, tooltipContent, marker)
      );
      marker.setMap(gMap);
    },

    /**
     * Get Details for Google Place.
     * @param {object} data The details for the location
     * @param {object} marker The Google Maps Marker
     * @param {object} map The Google Map
     */
    _getGoogleDetails: function(id, map, callback) {
      if (!id) {
        return;
      }
      var request = {
        placeId: id
      };
      var service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function(callback, details, status) {
        if (details) {
          return callback(details);
        } else {
          return;
        }
      }.bind(this, callback));
    },

    tooltip: function(loc) {
      const address   = loc.google ? loc.google.formatted_address : null;
      const rating    = loc.google ? loc.google.rating : null;
      const phone     = loc.google ? loc.google.formatted_phone_number : null;
      const website   = loc.google ? loc.google.website.replace(/.*?:\/\//g, "") : null;
      const more      = loc.google ? (<a className="glyphicon glyphicon-link" href={loc.google.url} target="_blank"></a>) : null;
      const classes   = loc.google ? "infowindow-google infowindow" : "infowindow";
      const tooltip   = (
        <div className={classes}>
          <a href={"/station/" + loc.objectId}>
            <p className="name">{loc.channelName}</p>
          </a>
          <p className="address">{address}</p>
          <a href={website} target="_blank"><p className="website">{website}</p></a>
          <p className="phone">{phone}</p>
          <p className="rating">{rating}</p>
          <p className="description">
            {loc.description}
          </p>
          {more}
        </div>
      );
      return ReactDOMServer.renderToString(tooltip);
    },

    render: function () {
      return (
        <div>
          <div ref="map" className="canvasMap"></div>
        </div>
      );
    }
  });

  module.exports = GoogleMapper;
}());