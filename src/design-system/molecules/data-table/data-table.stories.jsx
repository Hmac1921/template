import { fn } from "@storybook/test";
import DataTable from "./data-table";

export default {
  component: DataTable,
  title: "Molecules/DataTable",
  tags: ["autodocs"],
};

const Template = (args) => <DataTable {...args} />;

export const Default = Template.bind({});
Default.args = {
  version: "primary",
  label: "DataTable Main",
  id: "template-component",
  onClick: fn(),
};
