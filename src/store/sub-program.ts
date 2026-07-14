import { ICorporatesProgram } from '@/types/corporate';
import moment from 'moment';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IStore{
	data: ICorporatesProgram | null;
	date?: string | null;
}


interface SubProgramStore{
	store: IStore,
	storeSubProgram: (data: ICorporatesProgram) => void;
	reset: () => void;
}

const getInitialStore = (): IStore => {
	if(typeof window !== 'undefined' && window.localStorage){
		const initialValue = localStorage.getItem('subprogram');
		return initialValue ? JSON.parse(initialValue) : {data: null, date: null}
	}

	return {data: null, date: null}
}

const useSubProgram = create<SubProgramStore>()(
	persist((set, get) => {
		return ({
			store: getInitialStore(),
			storeSubProgram: (data) => set((state) => ({
				store: {
					...state?.store,
					data: {
						...state?.store?.data,
						...data
					},
					date: moment().format("YYYY-MM-DD HH:mm")
				},
			})),
			reset: () => {useSubProgram.persist.clearStorage()}
		})
	}, {name: 'subprogram'}
	)
)

export {useSubProgram}