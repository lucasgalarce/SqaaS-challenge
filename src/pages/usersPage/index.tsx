import React from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface FilterDropdownProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
}

const fetchUsers = async (): Promise<{ users: User[] }> => {
  const response = await fetch("https://dummyjson.com/users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const UsersPage: React.FC = () => {
  const { data, isLoading } = useQuery(["users"], fetchUsers);

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
  };

  const handleReset = (clearFilters?: () => void) => {
    if (clearFilters) clearFilters();
  };

  const getColumnSearchProps = (dataIndex: keyof User) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value: string | number | boolean, record: User) => {
      const itemValue = record[dataIndex];
      if (itemValue == null) {
        return false;
      }
      const itemString = itemValue.toString().toLowerCase();
      const filterValueString = value.toString().toLowerCase();
      return itemString.includes(filterValueString);
    },
  });

  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <img src={url} alt="User" style={{ width: 50, height: 50 }} />
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table
      dataSource={data?.users}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 13 }}
    />
  );
};
