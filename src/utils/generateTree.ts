import { MenuData } from "@/api/config/menu"
export interface ITreeItemData extends MenuData {
  children?: ITreeItemData[]
}
type IMap = Record<number | string, ITreeItemData>
const generateTree = (list: MenuData[]): ITreeItemData[] => {
  // 生成一个map key为id value为当前对象
  const map = list.reduce((prev, cur) => {
    const temp = { ...cur }
    prev[cur.id as number] = temp
    return prev
  }, {} as IMap)
  const tree: ITreeItemData[] = []
  list.forEach((item) => {
    const temp = map[item.id as number]
    const pid = temp.parent_id
    if ((pid != null || pid !== 0) && map[pid]) {
      const parent = map[pid]
      if (!parent.children) parent.children = []
      parent.children.push(temp)
      return
    }
    tree.push(temp)
  })
  return tree
}
type ITreeItemDataWithMeta = ITreeItemData & {
  meta?: {
    icon: string
    title: string
  }
}
type IMapWithMeta = Record<number | string, ITreeItemDataWithMeta>
const generateMenuTree = (list: MenuData[]): ITreeItemData[] => {
  // 生成一个map key为id value为当前对象
  const map = list.reduce((prev, cur) => {
    const temp = { ...cur }
    prev[cur.id as number] = temp
    return prev
  }, {} as IMapWithMeta)
  const tree: ITreeItemData[] = []
  list.forEach((item) => {
    const temp = map[item.id as number]
    temp.meta = {
      title: temp.title,
      icon: temp.icon
    }
    const pid = temp.parent_id
    if ((pid != null || pid !== 0) && map[pid]) {
      const parent = map[pid]
      if (!parent.children) parent.children = []
      parent.children.push(temp)
      return
    }
    tree.push(temp)
  })
  return tree
}

export { generateTree, generateMenuTree }
