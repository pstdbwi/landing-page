'use client';

import { CampaignCard } from '@/components/CampaignCard';
import { Checkbox } from '@/components/Checkbox';
import { Empty } from '@/components/Empty';
import { Label } from '@/components/Label';
import { RadioGroup, RadioGroupItem } from '@/components/Radio';
import { CampaignListSkeleton } from '@/components/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tab';
import { env } from "@/lib/env";
import { typeCampaign } from '@/lib/typeCampaign';
import useSession from '@/lib/use-session';
import { cn, qs } from '@/lib/utils';
import { SpecialSectionDetail } from '@/types';
import axios from 'axios';
import { ArrowDownUpIcon, LayoutGridIcon, Settings2Icon, XIcon } from 'lucide-react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const Header = dynamic(() => import('@/components/Header').then((mod) => mod.Header));

export default function SpecialSection({ params }: { params: { id: string } }) {
	const router = useRouter();
	const id = params?.id;
	const { session } = useSession()
	const corpId = session?.corp_id || '';
	const [state, setState] = useState<{data: any, isLoading: boolean, isError: boolean}>({
		data: [[]],
		isLoading: false,
		isError: false
	})

	const pathname = usePathname();
	const searchParams = useSearchParams()!;

	const sortType = searchParams.get('sort') || 'terbaru';
	const campaignType = searchParams.get('campaign_type') || '';
	const regionLevel = searchParams.get('region') || 'HQ'
	const arrayCampaignType = campaignType?.split(',');

	const [openType, setOpenType] = React.useState(false);
	const [openSort, setOpenSort] = React.useState<boolean>(false);
	const [gridView, setGridView] = React.useState<boolean>(false);
	const [hasRegional, setHasRegional] = React.useState<boolean>(false);

	const [sort] = useState<Array<{ id: number; name: string }>>([
		{
			id: 1,
			name: 'terbaru',
		},
		{
			id: 2,
			name: 'terlama',
		},
		{
			id: 3,
			name: 'terbanyak',
		},
	]);

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams();
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	useEffect(()=>{
		const fetchData = async () => {
			setState((prev) => ({...prev, isLoading: true}));
			try {
				const response = await axios.get(`${env.NEXT_PUBLIC_BASE_URL}/special-sections/${id}?region_level=${regionLevel}`)
				setState({
					data: response?.data?.data,
					isError: false,
					isLoading: false
				})
				setHasRegional(response?.data?.data?.[0]?.has_regional == 1)
			} catch (error) {
				setState((prev) => ({...prev, isLoading: false, isFetching: false, isError: true}))
			}finally{
				setState((prev) => ({...prev, isLoading: false, isFetching: false, }))
			}
		}

		if(id){
			fetchData()
		}

	},[corpId, id,regionLevel])


	const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
		<div className="relative layout bg-white min-h-screen">
			<Header title={state?.data?.[0]?.title || "Program"} className="left-0 top-0" searchIcon backTo="/" />
			<div className="grid grid-cols-3 border-b z-50 mt-16 fixed layout w-full bg-white">
				<button
					className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
					onClick={() => {
						setOpenType(!openType);
						setOpenSort(false);
					}}
				>
					<Settings2Icon size={18} className="text-gray-500" />
					<Label className="text-gray-500">Tipe</Label>
				</button>
				<button
					className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
					onClick={() => {
						setOpenType(false);
						setOpenSort(!openSort);
					}}
				>
					<ArrowDownUpIcon size={18} className="text-gray-500" />
					<Label className="text-gray-500">Urutkan</Label>
				</button>
				<button className="p-4 inline-flex items-center justify-center gap-2" onClick={() => setGridView(!gridView)}>
					<LayoutGridIcon size={18} className="text-gray-500" />
				</button>
			</div>
			{children}
		</div>
	);

	const RenderCampaignList = (): JSX.Element => {
		if (state?.isLoading) {
			return <CampaignListSkeleton orientation="vertical" />;
		}

		if (state?.isError) {
			return <Empty type="campaign" />;
		}

		const filteredData = state?.data?.[0]?.special_section_details?.filter((data: SpecialSectionDetail) =>{
			const {campaign} = data;
			if(!campaignType){
				return data
			}else{
				return arrayCampaignType?.includes(String(campaign?.type))
			}
		}).sort((a: SpecialSectionDetail,b: SpecialSectionDetail) => {
			if(sortType == 'terbaru'){
				return moment(a?.campaign?.created_at).valueOf() - moment(b?.campaign?.created_at).valueOf()
			}else if (sortType == 'terlama'){
				return moment(b?.campaign?.created_at).valueOf() - moment(a?.campaign?.created_at).valueOf()
			}else if(sortType == 'terbanyak'){
				return b?.campaign?.total_donation_amount - a?.campaign?.total_donation_amount
			}else{
				return 0
			}
		})

		if(!filteredData?.length){
			return <div className='pt-16'>
				<Empty type="campaign" />
			</div>;
		}

		return (
			<div className='relative'>
					<div className='bg-white h-14 fixed max-w-md w-full z-10 border-b border-b-gray-100'></div>
					<div className={cn('grid pt-16', gridView ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-2')}>
						{filteredData?.map((items: SpecialSectionDetail) => {
							const { id, campaign } = items;

							return (
								<CampaignCard
									key={id}
									campaignId={campaign?.id}
									title={campaign?.title}
									campaigner={campaign?.lembaga}
									cover={campaign?.banner_url}
									expired={campaign?.expired}
									donationTarget={campaign?.donation_target}
									variant={gridView ? 'vertical' : 'default'}
									location={`${campaign?.location?.district} , ${campaign?.location?.city}`}
									donationAmount={campaign?.total_donation_amount}
									campaignType={campaign?.type}
									isPermanent={campaign?.is_permanent}
								/>
							);
						})}
					</div>
			</div>
			
		);
	};

	const triggerTab = (region_level: string) => {
		const query = qs({
			campaign_type: campaignType,
			sort: sortType,
			region: region_level
		}).replaceAll('%2C', ',')

		router.push(`${pathname}?${query}`)
	}

	return (
		<Wrapper>
			<section className={cn("p-5 space-y-4", hasRegional ? "pt-[110px]" :"pt-[50px]")}>
				<div className='max-w-md w-full h-6 bg-white z-10 fixed'></div>
				
				{hasRegional ? 
				<Tabs value={regionLevel} className="w-full relative" onValueChange={(value)=> triggerTab(value) }>
					<TabsList className="max-w-md w-full fixed z-20 rounded-lg">
						<TabsTrigger value="HQ" className="w-full rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white">Pusat</TabsTrigger>
						<TabsTrigger value="R" className="w-full rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white">Daerah</TabsTrigger>
					</TabsList>
					<TabsContent value="HQ">
						<div className="my-2">
							<RenderCampaignList />
						</div>
					</TabsContent>
					<TabsContent value="R">
						<div className="my-2">
							<RenderCampaignList />
						</div>
					</TabsContent>
				</Tabs>
				:
					<RenderCampaignList />
				}
			
			</section>
			{openType ? (
				<div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
					<div className="w-full relative mb-8">
						<button onClick={() => setOpenType(!openType)}>
							<XIcon size={20} className="absolute left-2 bottom-0" />
						</button>
						<h1 className="text-base font-semibold text-center">Pilih Tipe</h1>
					</div>
					{typeCampaign?.map((type) => (
						<div className="p-2 w-full inline-flex gap-3 rounded-md items-center" key={type?.id}>
							<Label htmlFor={type?.name} className="w-full text-base font-semibold">
								{type?.name}
							</Label>
							<Checkbox
								checked={arrayCampaignType.includes(type?.id)}
								value={type?.id}
								onCheckedChange={(value) => {
									let filterCorporate;
									if (value) {
										filterCorporate = `campaign_type=${campaignType ? campaignType + ',' + type?.id : type?.id}`;
									} else {
										const filterCampaignType = campaignType
											?.split(',')
											.filter((item) => item != type?.id)
											.join(',');
										filterCorporate = `campaign_type=${filterCampaignType}`;
									}
									router.push(
										`${pathname}?${filterCorporate}&${createQueryString('sort', sortType)}&${createQueryString('region', regionLevel)}`,
									);
								}}
							/>
						</div>
					))}
				</div>
			) : null}
			{openSort ? (
				<div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
					<div className="w-full relative mb-8">
						<button onClick={() => setOpenSort(!openSort)}>
							<XIcon name="x" size={20} className="absolute left-2 bottom-0" />
						</button>
						<h1 className="text-base font-semibold text-center">Urutkan</h1>
					</div>
					<RadioGroup defaultValue={sortType} className="space-y-3">
						{sort.map((sort, index: number) => {
							return (
								<div
									key={index}
									className="flex items-center justify-between space-x-2"
									onClick={() => {
											router.push(`${pathname}?campaign_type=${campaignType}&${createQueryString('sort', sort.name)}&${createQueryString('region', regionLevel)}`);
									}}
								>
									<Label htmlFor={sort.name} className="flex items-center gap-2">
										<span className="text-base font-semibold">{sort.name}</span>
									</Label>
									<RadioGroupItem value={sort.name} id={sort.name} />
								</div>
							);
						})}
					</RadioGroup>
				</div>
			) : null}
			{openSort || openType ? <div aria-hidden className="h-full bg-black/20 w-full absolute top-0 z-20"></div> : null}
		</Wrapper>
	);
}
