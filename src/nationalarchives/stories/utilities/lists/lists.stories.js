const argTypes = {
  items: { control: "object" },
  plain: { control: "boolean" },
  classes: { control: "text" },
};

export default {
  title: "Utilities/Lists",
  argTypes,
};

const UnorderedListTemplate = ({ items, plain, classes }) =>
  `<ul class="tna-ul${plain ? " tna-ul--plain" : ""} ${classes}">${items.reduce(
    (list, item) => `${list}<li>${item}</li>`,
    "",
  )}</ul>`;
export const UnorderedList = UnorderedListTemplate.bind({});
UnorderedList.args = {
  items: ["Alpha", "Beta", "Gamma"],
};
export const UnorderedListPlain = UnorderedListTemplate.bind({});
UnorderedListPlain.args = {
  items: ["Alpha", "Beta", "Gamma"],
  plain: true,
};

const OrderedListTemplate = ({ items, plain, classes }) =>
  `<ol class="tna-ol${plain ? " tna-ol--plain" : ""} ${classes}">${items.reduce(
    (list, item) => `${list}<li>${item}</li>`,
    "",
  )}</ol>`;
export const OrderedList = OrderedListTemplate.bind({});
OrderedList.args = {
  items: ["Alpha", "Beta", "Gamma"],
};
export const OrderedListPlain = OrderedListTemplate.bind({});
OrderedListPlain.args = {
  items: ["Alpha", "Beta", "Gamma"],
  plain: true,
};

const DescriptionListTemplate = ({ items, plain, classes }) =>
  `<dl class="tna-dl${plain ? " tna-dl--plain" : ""}${
    items.some((item) => item.icon) ? " tna-dl--icon-padding" : ""
  } ${classes}">${items.reduce(
    (list, item) => `${list}
    <dt>
      ${item.icon ? `<i class="fa-solid fa-${item.icon}"></i>` : ""}
      ${item.title}
    </dt>
    ${
      Array.isArray(item.description)
        ? item.description.reduce(
            (descriptions, description) =>
              `${descriptions}<dd>${description}</dd>`,
            "",
          )
        : `<dd>${item.description}</dd>`
    }`,
    "",
  )}
</dl>`;

export const DescriptionList = DescriptionListTemplate.bind({});
DescriptionList.args = {
  items: [
    { title: "Alpha", description: "Lorem ipsum" },
    { title: "Beta", description: "Lorem ipsum" },
    { title: "Gamma", description: "Lorem ipsum" },
    { title: "Delta", description: "Lorem ipsum" },
    { title: "Epsilon", description: "Lorem ipsum" },
    { title: "Zeta", description: "Lorem ipsum" },
    { title: "Eta", description: "Lorem ipsum" },
  ],
};

export const PlainDescriptionList = DescriptionListTemplate.bind({});
PlainDescriptionList.args = {
  items: [
    { title: "Alpha", description: "Lorem ipsum" },
    { title: "Beta", description: "Lorem ipsum" },
    { title: "Gamma", description: "Lorem ipsum" },
    { title: "Delta", description: "Lorem ipsum" },
  ],
  plain: true,
};

export const DescriptionListWithIcons = DescriptionListTemplate.bind({});
DescriptionListWithIcons.args = {
  items: [
    {
      title: "Held by",
      description: "The National Archives, Kew",
      icon: "landmark",
    },
    { title: "Date", description: "1972&ndash;1979", icon: "calendar" },
    { title: "Reference", description: "LC 4", icon: "database" },
  ],
};

export const PlainDescriptionListWithIcons = DescriptionListTemplate.bind({});
PlainDescriptionListWithIcons.args = {
  items: [
    {
      title: "Held by",
      description: "The National Archives, Kew",
      icon: "landmark",
    },
    { title: "Date", description: "1972&ndash;1979", icon: "calendar" },
    { title: "Reference", description: "LC 4", icon: "database" },
  ],
  plain: true,
};

export const ComplexDescriptionList = DescriptionListTemplate.bind({});
ComplexDescriptionList.args = {
  items: [
    { title: "Alpha", description: "Lorem ipsum" },
    { title: "Beta", description: "Lorem ipsum" },
    {
      title: "Gamma",
      description: ["Lorem ipsum 1", "Lorem ipsum 2", "Lorem ipsum 3"],
    },
    {
      title: "Delta",
      description: ["Lorem ipsum 1", "Lorem ipsum 2", "Lorem ipsum 3"],
    },
    { title: "Epsilon", description: ["Lorem ipsum 1", "Lorem ipsum 2"] },
    { title: "Zeta", description: "Lorem ipsum" },
    { title: "Eta", description: ["Lorem ipsum 1", "Lorem ipsum 2"] },
  ],
};

const ChipListTemplate = ({ items, plain, classes }) =>
  `<ul class="tna-chip-list ${classes}">${items.reduce(
    (list, item) => `${list}<li class="tna-chip-list__item">
      <span class="tna-chip${plain ? " tna-chip--plain" : ""}">
        ${item.icon ? `<i class="fa-solid fa-${item.icon}"></i>` : ""}
        ${item.text}
      </span>
    </li>`,
    "",
  )}</ul>`;
export const ChipList = ChipListTemplate.bind({});
ChipList.args = {
  items: [
    { text: "Alpha", icon: "heart" },
    { text: "Beta" },
    { text: "Gamma" },
  ],
};
