import React from "react";
import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import MyMenu from "./MyMenu";
import "antd/dist/antd.css";
import data from "./data";

let root = data[0];
let dataMap = {};
let allDept = [];
data.forEach(item => {
    dataMap["dept_" + item.key] = item;
    allDept.push(item.key);
});
class Sider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAll: true,
            openKeys: allDept,
            Menu: props.type === 1 ? Menu : MyMenu
        };
    }
    renderDept = item => {
        const { dept, key, name, user } = item;
        const SubMenu = this.state.Menu.SubMenu;
        return (
            <SubMenu
                key={key}
                title={
                    <div className="wrap">
                        <SettingOutlined />
                        {/* <span>{name}</span> */}
                        <span>部门{key}</span>
                    </div>
                }
            >
                {user.map(jItem => {
                    return this.renderUser(jItem);
                })}

                {dept.map(dItem => {
                    return this.renderDept(dataMap["dept_" + dItem]);
                })}
            </SubMenu>
        );
    };
    renderUser = id => {
        return (
            <Menu.Item key={id}>
                <div style={{ textAlign: "left" }}>用户{id}</div>
            </Menu.Item>
        );
    };
    openChange = arr => {
        this.setState({
            openKeys: arr
        });
    };
    handler = showAll => {
        let next = showAll ? allDept : [];
        this.setState({
            showAll,
            openKeys: next
        });
    };
    render() {
        let M = this.state.Menu;
        return (
            <div className="App">
                <div className="test-wrap">
                    <div
                        style={{
                            color: this.state.showAll ? "blue" : "black",
                            cursor: "pointer"
                        }}
                        onClick={this.handler.bind(this, true)}
                    >
                        全部展开
                    </div>
                    <div
                        style={{
                            color: !this.state.showAll ? "blue" : "black",
                            cursor: "pointer"
                        }}
                        onClick={this.handler.bind(this, false)}
                    >
                        全部收起
                    </div>
                    <M
                        openKeys={this.state.openKeys}
                        onOpenChange={this.openChange}
                        mode="inline"
                        inlineIndent={14}
                        // inlineCollapsed={true}
                    >
                        {root.dept.map(item => {
                            return this.renderDept(dataMap["dept_" + item]);
                        })}
                    </M>
                </div>
            </div>
        );
    }
}

export default Sider;
