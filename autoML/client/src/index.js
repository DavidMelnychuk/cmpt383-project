import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Particles from 'react-particles-js';

// Particles Preset taken from https://rpj.bembi.org/#bubbles
ReactDOM.render(
	<Particles
		params={{
			"particles": {
				"number": {
					"value": 250,
					"density": {
						"enable": false
					}
				},
				"size": {
					"value": 3,
					"random": true,
					"anim": {
						"speed": 4,
						"size_min": 0.3
					}
				},
				"line_linked": {
					"enable": false
				},
				"move": {
					"random": true,
					"speed": 1,
					"direction": "top",
					"out_mode": "out"
				}
			},
			"interactivity": {
				"events": {
					"onhover": {
						"enable": true,
						"mode": "bubble"
					},
					"onclick": {
						"enable": true,
						"mode": "repulse"
					}
				},
				"modes": {
					"bubble": {
						"distance": 250,
						"duration": 2,
						"size": 0,
						"opacity": 0
					},
					"repulse": {
						"distance": 400,
						"duration": 4
					}
				}
			}
		}} />, document.getElementById('particles-js'));
ReactDOM.render(<App />, document.getElementById('root'));