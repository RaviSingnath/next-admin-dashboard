"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type MenuGroup } from "@/lib/navigation/menu-config";
import { ChevronDownIcon } from "../../icons/index";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

type MenuItemsProps = {
  navItems: MenuGroup[];
  menuType: "main" | "others";
};

export default function MenuItems({ navItems, menuType }: MenuItemsProps) {
  console.log(navItems);
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const isActive = (path: string) => path === pathname;
  const matchedSubmenu = (() => {
    const items = navItems;
    for (const [index, nav] of items.entries()) {
      if (nav.subItems?.some((subItem) => isActive(subItem.path))) {
        return { type: "main", index };
      }
    }

    return null;
  })();

  const activeSubmenu = openSubmenu ?? matchedSubmenu;

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (activeSubmenu !== null) {
      const key = `${activeSubmenu.type}-${activeSubmenu.index}`;
      if (subMenuRefs.current[key] && !subMenuHeight[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [activeSubmenu, subMenuHeight]);

  return (
    <ul className="flex flex-col gap-4">
      {navItems.map(({ icon: Icon, ...nav }, index) => (
        <li key={nav.name}>
          {nav.name ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                activeSubmenu?.type === menuType &&
                activeSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  activeSubmenu?.type === menuType &&
                  activeSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {Icon && <Icon size={20} />}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    activeSubmenu?.type === menuType &&
                    activeSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  activeSubmenu?.type === menuType &&
                  activeSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map(({ icon: Icon, ...subItem }) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <span
                        className={` ${
                          isActive(subItem.path)
                            ? "menu-dropdown-badge-active"
                            : "menu-dropdown-badge-inactive"
                        }  `}
                      >
                        {Icon && <Icon size={16} />}
                      </span>
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
