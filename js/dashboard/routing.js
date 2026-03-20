export const dashboardRouting = {
	init() {
		const txParam = new URLSearchParams(window.location.search).get('tx');
		if (txParam) {
			this.fhirBaseUrl = txParam.replace(/\/$/, '');
		}
		this.loadCapabilityStatement();
		window.addEventListener('hashchange', () => this.initFromHash());
		this.initFromHash();
	},

	initFromHash() {
		const hash = window.location.hash.replace('#', '');
		if (hash) {
			const parts = hash.split('/');
			const section = parts[0];
			const tab = parts[1];
			if (section === 'resources') {
				this.section = 'resources';
				if (tab === 'codesystem' || tab === 'valueset' || tab === 'conceptmap') {
					this.tab = tab;
					this.loadTabIfNeeded();
				}
			} else if (section === 'syndication') {
				this.section = 'syndication';
				this.loadSyndicationIfNeeded();
			} else if (section === 'upload-sct') {
				this.section = 'upload-sct';
			}
		} else {
			this.section = 'resources';
			this.tab = 'codesystem';
			this.setHash();
			this.loadCodeSystems();
		}
	},

	setHash() {
		if (this.section === 'resources') {
			window.location.hash = `resources/${this.tab}`;
		} else {
			window.location.hash = this.section;
		}
	},

	switchTab(t) {
		this.tab = t;
		this.setHash();
		this.loadTabIfNeeded();
	},

	loadTabIfNeeded() {
		if (this.tab === 'codesystem' && this.codeSystems.length === 0 && !this.loadingCodesystems) {
			this.loadCodeSystems();
		} else if (this.tab === 'valueset' && this.valueSets.length === 0 && !this.loadingValueSets) {
			this.loadValueSets();
		} else if (this.tab === 'conceptmap' && this.conceptMaps.length === 0 && !this.loadingConceptMaps) {
			this.loadConceptMaps();
		}
	},

	loadSyndicationIfNeeded() {
		if (!this.syndicationAvailable) {
			return;
		}
		if (this.editions.length === 0 && !this.loadingSyndication) {
			this.loadSyndicationEditions();
		}
	}
};
