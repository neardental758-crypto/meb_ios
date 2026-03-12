export default class UserInfoModel {
	id: string
	name: string;
	category: number;
	ranking: number;
	points: number;
	skills: string;
	achievement: string;
	photo: string;
	birthday: Date;
	description: string;
	gender: string;
	membership: string;
	activity: string;
	careerModeCount?: number;
	totalDistance?: number;
	totalAltitude?: number;
	averageSpeed?: number;
	averagePace?: number;
	speedQuartile?: number;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
	clubId: string;
	locationId: string;
	userId: string;

	constructor() { }
}