import { useState } from "react";
import { Item, ItemGroup, ItemsRes } from "../types";
import useGet from "../hooks/useGet";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import GroupFilter from "./GroupFilter";
import { Link } from "react-router-dom";
import ItemCard from "./ItemCard";

function flattenGroups(itemGroups: ItemGroup[]) {
    let arr: ItemGroup[] = [];
    for (let group of itemGroups) {
        arr.push(group);
        if (group.children.length>0) {
            arr.push(...flattenGroups(group.children))
        }
    }
    return arr;
}

export default function ShopPage() {
    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [groups] = useGet<ItemGroup[]>('/item-group', []);
    const [items] = useGet<ItemsRes | undefined>('/item', undefined, {
        groupId: selectedGroupId + ''
    });
    const flattened = flattenGroups(groups);
    function getGroupBreadcrumb(group?: ItemGroup): string {
        if (!group) {
          return '';
        }
        //@ts-ignore
        return getGroupBreadcrumb(flattened.find(e => e.id === group.parentGroup)) + ' - ' + group.name + '';
    }

    return (
        <FlexboxGrid>
            <FlexboxGridItem colspan={3}>
                <GroupFilter onSelect={setSelectedGroupId} itemGroups={groups} />
            </FlexboxGridItem>

            <FlexboxGridItem colspan={1}>
            </FlexboxGridItem>
            <FlexboxGridItem colspan={12}>
                <h2 style={{ textTransform: 'capitalize', textAlign: 'center' }}>
                    {getGroupBreadcrumb(flattened.find(e => e.id == selectedGroupId)).substring(3)}
                </h2>
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px'
                    }}
                >
                    {
                        (items?.data || []).map(item => {
                        return (
                            <div key={item.id} style={{ flex: '1' }}>
                            <Link to={`/item/${item.id}`}>
                                <ItemCard item={item} />
                            </Link>
                            </div>
                        )
                        })
                    }
                </div>
            </FlexboxGridItem>
        </FlexboxGrid>
    )
}