import { AJAX_TIMEOUT_MS } from './constants.js';
import { fetchWithTimeout } from './http.js';

export const dashboardModalDetail = {
	async viewDetail(type, id) {
		this.modalType = type;
		this.modalLoading = true;
		this.modalDetail = null;
		this.modalError = null;
		const modalEl = document.getElementById(type + 'Modal');
		const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
		modal.show();

		const url = `${this.fhirBaseUrl}/${type === 'codesystem' ? 'CodeSystem' : type === 'valueset' ? 'ValueSet' : 'ConceptMap'}/${id}`;
		let res;
		try {
			res = await fetchWithTimeout(url, AJAX_TIMEOUT_MS);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Not found');
			this.modalDetail = data;
		} catch (err) {
			if (err.name === 'AbortError') this.modalError = 'Request timed out. Please try again.';
			else if (typeof res !== 'undefined' && res.status === 404) this.modalError = `${type === 'codesystem' ? 'CodeSystem' : type === 'valueset' ? 'ValueSet' : 'ConceptMap'} not found.`;
			else if (typeof res !== 'undefined' && res.status === 500) this.modalError = 'Server error. Please try again later.';
			else this.modalError = err.message || 'Error loading details';
		} finally {
			this.modalLoading = false;
		}
	}
};
