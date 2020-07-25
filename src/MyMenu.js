import * as React from "react";
import { findDOMNode } from "react-dom";
import RcMenu, { Divider, ItemGroup } from "rc-menu";

import classNames from "classnames";

import { Menu } from "antd";
const { SubMenu, Item } = Menu;

export default class MyMenu extends React.Component {
  static Divider = Divider;
  static Item = Item;
  static SubMenu = SubMenu;
  static ItemGroup = ItemGroup;
  static defaultProps = {
    prefixCls: "ant-menu",
    className: "",
    theme: "light", // or dark
    focusable: false,
  };

  constructor(props) {
    super(props);

    let openKeys;
    if ("defaultOpenKeys" in props) {
      openKeys = props.defaultOpenKeys;
    } else if ("openKeys" in props) {
      openKeys = props.openKeys;
    }

    this.state = {
      openKeys: openKeys || [],
    };
  }
  getChildContext() {
    return {
      inlineCollapsed: this.getInlineCollapsed(),
      antdMenuTheme: this.props.theme,
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const { prefixCls } = this.props;
    if (this.props.mode === "inline" && nextProps.mode !== "inline") {
      this.switchModeFromInline = true;
    }
    if ("openKeys" in nextProps) {
      this.setState({ openKeys: nextProps.openKeys });
      return;
    }
    if (
      (nextProps.inlineCollapsed && !this.props.inlineCollapsed) ||
      (nextContext.siderCollapsed && !this.context.siderCollapsed)
    ) {
      const menuNode = findDOMNode(this);
      this.switchModeFromInline =
        !!this.state.openKeys.length &&
        !!menuNode.querySelectorAll(`.${prefixCls}-submenu-open`).length;
      this.inlineOpenKeys = this.state.openKeys;
      this.setState({ openKeys: [] });
    }
    if (
      (!nextProps.inlineCollapsed && this.props.inlineCollapsed) ||
      (!nextContext.siderCollapsed && this.context.siderCollapsed)
    ) {
      this.setState({ openKeys: this.inlineOpenKeys });
      this.inlineOpenKeys = [];
    }
  }
  handleClick = (e) => {
    this.handleOpenChange([]);

    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  };
  handleOpenChange = (openKeys) => {
    this.setOpenKeys(openKeys);

    const { onOpenChange } = this.props;
    if (onOpenChange) {
      onOpenChange(openKeys);
    }
  };
  setOpenKeys(openKeys) {
    if (!("openKeys" in this.props)) {
      this.setState({ openKeys });
    }
  }
  getRealMenuMode() {
    const inlineCollapsed = this.getInlineCollapsed();
    if (this.switchModeFromInline && inlineCollapsed) {
      return "inline";
    }
    const { mode } = this.props;
    return inlineCollapsed ? "vertical" : mode;
  }
  getInlineCollapsed() {
    const { inlineCollapsed } = this.props;
    if (this.context.siderCollapsed !== undefined) {
      return this.context.siderCollapsed;
    }
    return inlineCollapsed;
  }
  getMenuOpenAnimation(menuMode) {
    const { openAnimation, openTransitionName } = this.props;
    let menuOpenAnimation = openAnimation || openTransitionName;
    if (openAnimation === undefined && openTransitionName === undefined) {
      switch (menuMode) {
        case "horizontal":
          menuOpenAnimation = "slide-up";
          break;
        case "vertical":
        case "vertical-left":
        case "vertical-right":
          // When mode switch from inline
          // submenu should hide without animation
          if (this.switchModeFromInline) {
            menuOpenAnimation = "";
            this.switchModeFromInline = false;
          } else {
            menuOpenAnimation = "zoom-big";
          }
          break;
        case "inline":
          // menuOpenAnimation = {
          //   ...animation,
          //   leave: (node: HTMLElement, done: () => void) => animation.leave(node, () => {
          //     // Make sure inline menu leave animation finished before mode is switched
          //     this.switchModeFromInline = false;
          //     this.setState({});
          //     // when inlineCollapsed change false to true, all submenu will be unmounted,
          //     // so that we don't need handle animation leaving.
          //     if (this.getRealMenuMode() === 'vertical') {
          //       return;
          //     }
          //     done();
          //   }),
          // };
          break;
        default:
      }
    }
    return menuOpenAnimation;
  }

  render() {
    const { prefixCls, className, theme } = this.props;
    const menuMode = this.getRealMenuMode();
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode);

    const menuClassName = classNames(className, `${prefixCls}-${theme}`, {
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
    });

    const menuProps = {
      openKeys: this.state.openKeys,
      onOpenChange: this.handleOpenChange,
      className: menuClassName,
      mode: menuMode,
    };

    if (menuMode !== "inline") {
      // closing vertical popup submenu after click it
      menuProps.onClick = this.handleClick;
      menuProps.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.openAnimation = menuOpenAnimation;
    }

    // https://github.com/ant-design/ant-design/issues/8587
    const { collapsedWidth } = this.context;
    if (
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 ||
        collapsedWidth === "0" ||
        collapsedWidth === "0px")
    ) {
      return null;
    }

    return <RcMenu {...this.props} {...menuProps} />;
  }
}
