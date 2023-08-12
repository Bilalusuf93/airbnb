'use client'

import Container from "../Container"
import CategoryBox from '../../components/CategoryBox'
import { IoDiamond } from 'react-icons/io5'
import { BsSnow } from 'react-icons/bs'
import { FaSkiing } from 'react-icons/fa'
import {
    TbBeach,
    TbMountain,
    TbPool
} from 'react-icons/tb';
import {
    GiBarn,
    GiBoatFishing,
    GiCactus,
    GiCastle,
    GiCaveEntrance,
    GiForestCamp,
    GiIsland,
    GiWindmill
} from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import {
    usePathname,
    useSearchParams
} from "next/navigation";

export const categories = [
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'This property is close to beach'
    },
    {
        label: 'Windmills',
        icon: GiWindmill,
        description: 'This property is close to Windmill'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This property is Modern'
    },
    {
        label: 'CountrySide',
        icon: TbMountain,
        description: 'This property is country side'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'This property is pool'
    },
    {
        label: 'Island',
        icon: GiIsland,
        description: 'This property is island'
    },
    {
        label: 'Lake',
        icon: GiBoatFishing,
        description: 'This property close to lake'
    },
    {
        label: 'Skiing',
        icon: FaSkiing,
        description: 'This property close to skiing'
    },
    {
        label: 'Castle',
        icon: GiCastle,
        description: 'This property close to Castle'
    },
    {
        label: 'Camping',
        icon: GiForestCamp,
        description: 'This property close to Camping'
    },
    {
        label: 'Arctic',
        icon: BsSnow,
        description: 'This property close to BsSnow'
    },
    {
        label: 'Cave',
        icon: GiCaveEntrance,
        description: 'This property close to Cave'
    },
    {
        label: 'Desert',
        icon: GiCactus,
        description: 'This property close to Desert'
    },
    {
        label: 'Barns',
        icon: GiBarn,
        description: 'This property close to Barns'
    },
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'This property close to Lux'
    },
]
const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathName = usePathname();

    const isMainpage = pathName === '/';
    if (!pathName) {
        return null;
    }
    return (
        <Container>
            <div className="
            pt-4
            ml-3
            mr-3
            flex
            flex-row
            items-center
            justify-center
            overflow-x-auto
        ">
                {
                    categories?.map((item) => (
                        <CategoryBox
                            key={item.label}
                            label={item.label}
                            description={item.description}
                            icon={item.icon}
                            selected={category === item.label}
                        />
                    ))
                }
            </div>
        </Container>
    )
}

export default Categories