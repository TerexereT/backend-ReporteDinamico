import list from '../../Middlewares/list';

export const getPermiss = (value: any[]) => {
	let list: { [key: string]: number } = {};
	for (const key of value) {
		if (key.active) {
			let item: string = key.id_action.name;
			//console.log(item);
			list[item] = key.id_action.id;
		}
	}
	return list;
};

export const getViews = (access_views: any[]) => {
	let listViews: String[] = [];
	for (const key of access_views) {
		if (key.active) {
			let item: string = key.id_views.name;
			listViews.push(item);
			//console.log(item);
			//listViews[item] = key.id_views.id;
		}
	}
	return listViews;
};
