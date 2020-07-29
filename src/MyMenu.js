import React, { createContext } from "react";
import RcMenu, { Divider, ItemGroup } from "rc-menu";
import classNames from "classnames";
import { Menu } from "antd";
const ConfigContext = React.createContext({
    getPrefixCls: (suffixCls, customizePrefixCls) => {
        if (customizePrefixCls) return customizePrefixCls;

        return suffixCls ? `ant-${suffixCls}` : "ant";
    }
});

const ConfigConsumer = ConfigContext.Consumer;

const { SubMenu, Item } = Menu;

const MenuContext = createContext({
    inlineCollapsed: false
});
let SiderContext = React.createContext({});

class InternalMenu extends React.Component {
    static defaultProps = {
        className: "",
        theme: "light", // or dark
        focusable: false
    };

    constructor(props) {
        super(props);
    }

    getInlineCollapsed() {
        const { inlineCollapsed, siderCollapsed } = this.props;
        if (siderCollapsed !== undefined) {
            return siderCollapsed;
        }
        return inlineCollapsed;
    }

    renderMenu = ({ getPopupContainer, getPrefixCls, direction }) => {
        const { prefixCls: customizePrefixCls, className, theme } = this.props;
        const defaultMotions = {
            horizontal: { motionName: "slide-up" },
            inline: { motionLeaveImmediately: true },
            other: { motionName: "zoom-big" }
        };

        const prefixCls = getPrefixCls("menu", customizePrefixCls);
        const menuClassName = classNames(className, `${prefixCls}-${theme}`, {
            [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed()
        });

        return (
            <MenuContext.Provider
                value={{
                    inlineCollapsed: this.getInlineCollapsed() || false,
                    antdMenuTheme: theme,
                    direction
                }}
            >
                <RcMenu
                    getPopupContainer={getPopupContainer}
                    {...this.props}
                    className={menuClassName}
                    prefixCls={prefixCls}
                    direction={direction}
                    defaultMotions={defaultMotions}
                />
            </MenuContext.Provider>
        );
    };

    render() {
        return <ConfigConsumer>{this.renderMenu}</ConfigConsumer>;
    }
}

// We should keep this as ref-able
export default class MyMenu extends React.Component {
    static Divider = Divider;

    static Item = Item;

    static SubMenu = SubMenu;

    static ItemGroup = ItemGroup;

    render() {
        return (
            <SiderContext.Consumer>
                {context => <InternalMenu {...this.props} {...context} />}
            </SiderContext.Consumer>
        );
    }
}
