import moment from 'moment';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IState {
		page: 'login'|'home'|'history'|'campaign'|'profile'|'banner' | null;
		date?: string | null;
		campaign?: any;
}

interface VisitorHistoryStore {
	store: IState,
	storeVisitorHistory: (data: IState) => void;
	reset: () => void;
}

const useVisitorHistory = create<VisitorHistoryStore>()(
	persist((set) => ({
		store: {
			page: null,
			date: null,
			campaign: {}
		},
		storeVisitorHistory: (data) => set((state) => ({
			store: {
				...state.store,
				page: data?.page,
				date: moment(data?.date).format("YYYY-MM-DD"),
				campaign: data?.campaign
			}
		})),
		reset: () => { useVisitorHistory.persist.clearStorage() }
	}), {name: 'visitor'}
	)
)

export { useVisitorHistory }