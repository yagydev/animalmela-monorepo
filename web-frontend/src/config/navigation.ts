import { assertKnownRoutes, footerMatrix, getRoute, headerMatrix, type AppRole } from './appMatrix';

export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  description?: string;
  children?: NavItem[];
  cta?: boolean;
  highlight?: boolean;
  roles?: AppRole[];
}

export interface NavigationConfig {
  unified: NavItem[];
  footer: NavItem[];
}

function buildNavItem(path: string): NavItem {
  const route = getRoute(path);
  return {
    name: route.label,
    path: route.path,
    icon: route.icon,
    cta: route.cta,
    highlight: route.highlight,
    roles: route.roles
  };
}

const allReferencedPaths = [
  ...headerMatrix.flatMap((item) => [
    item.path,
    ...('children' in item ? item.children : [])
  ]),
  ...Object.values(footerMatrix).flatMap((paths) => paths)
];

assertKnownRoutes(allReferencedPaths, 'navigation');

export const navigationConfig: NavigationConfig = {
  unified: headerMatrix.map((item) => ({
    ...buildNavItem(item.path),
    children: ('children' in item ? item.children : undefined)?.map((childPath: string) =>
      buildNavItem(childPath)
    )
  })),
  footer: Object.values(footerMatrix)
    .flat()
    .map((path) => buildNavItem(path))
};

export default navigationConfig;