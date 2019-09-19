const statefulElements = document.getElementsByClassName('list__item_text');
const editableElements = document.getElementsByClassName('editable');
const buttons = document.getElementsByClassName('button');
const hasTagChildren = (element, tag) => [...element.children].map(element => element.tagName.toLowerCase()).includes(tag);

const siblingsArray = element => [...element.parentNode.children];

const maxId = [...statefulElements].reduce(
  (acc, current) => (Number(current.parentNode.id) > acc ? Number(current.parentNode.id) : acc),
  0
);

const makeCounter = () => {
  let counter = maxId;
  return () => (counter = Number(counter) + 1);
};

const getMenuElementContentId = menuElement =>
  `${menuElement.parentNode.id}_content`;

const makeId = makeCounter();
const makeContentId = id => `${id}_content`;

const toggleFoldedState = element => {
  if (element.parentNode.childElementCount === 4) {
    return;
  }
  element.classList.toggle('folded');
  element.parentNode.lastElementChild.classList.toggle('visually-hidden');
};

const toggleButtonsVisibilityForElement = element => {
  const buttons = [...element.parentNode.children].filter(element =>
    element.classList.contains('button')
  );
  const isActive = element.classList.contains('active');
  buttons.forEach(button =>
    isActive
      ? button.classList.remove('visually-hidden')
      : button.classList.add('visually-hidden')
  );
};

const setActiveMenuElement = element => {
  const activeElement = document.querySelector('.active.list__item_text');

  activeElement && activeElement.classList.toggle('active');
  element.classList.toggle('active');
  toggleButtonsVisibilityForElement(element);
  activeElement && toggleButtonsVisibilityForElement(activeElement);
};

const setActiveContent = currentMenuElement => {
  const activeMenuElement = document.querySelector('.active.list__item_text');
  const activeMenuElementContent =
    activeMenuElement &&
    document.getElementById(getMenuElementContentId(activeMenuElement));
  const currentMenuElementContent = document.getElementById(
    getMenuElementContentId(currentMenuElement)
  );

  activeMenuElement &&
    activeMenuElementContent.classList.add('visually-hidden');
  currentMenuElementContent.classList.remove('visually-hidden');
};

const setupSidebarNavigation = () =>
  [... statefulElements].forEach(element => element.onclick = () => handleOnClickElement(event.target));

setupSidebarNavigation();
const handleOnClickElement = element => {
  setActiveContent(element);
  setActiveMenuElement(element);
  toggleFoldedState(element);
};

const deleteSidebarElement = element => {
  element.parentNode.remove();
};

const makeElementEditable = element => {
  const setEditPossibility = isPossible => {
    if (isPossible) {
      element.contentEditable = true;
      element.focus();
      return;
    }
    element.contentEditable = false;
    element.style.cursor = element.classList.contains('list__item_text')
      ? 'pointer'
      : 'auto';
  };
  setEditPossibility(true);
  element.onblur = () => setEditPossibility(false);
  element.onkeydown = event => {
    if(event.keyCode === 13) { 
      setEditPossibility(false);
    }
  }
};

const makeElementsEditableOnButtonClick = buttons => {
  const editableElement = button =>
    siblingsArray(button).find(element =>
      element.classList.contains('editable')
    );
  buttons.forEach(
    button =>
      (button.onclick = event =>
        makeElementEditable(editableElement(event.target)))
  );
};

const setButtonsOnClickEvents = () => {
  const buttonsDeleteArray = [...buttons].filter(element =>
    element.classList.contains('button-delete')
  );
  const buttonsAddArray = [...buttons].filter(element =>
    element.classList.contains('button-add')
  );
  const buttonsEditArray = [...buttons].filter(element =>
    element.classList.contains('button-edit')
  );
  
  makeElementsEditableOnButtonClick(buttonsEditArray);
  buttonsDeleteArray.forEach(
    button => (button.onclick = event => deleteSidebarElement(event.target))
  );
  buttonsAddArray.forEach(
    button =>
      (button.onclick = event => {
        const parent = event.target.parentNode;
        const newChildren = makeMenuElement(parent);
        const heading = [... parent.children].find(element => element.classList.contains('list__item_text'))
        appendNewElement(parent, newChildren);
        const newContent = makeContent(newChildren.li);
        appendContent(newContent);
        heading.classList.contains('folded') && toggleFoldedState(heading)
        setupSidebarNavigation();
        setActiveMenuElement(newChildren.heading);
        makeElementEditable(newChildren.heading);
      })
  );
};

setButtonsOnClickEvents();



const makeMenuElement = parent => {
  const newElementListLevel = () => {
    if (parent.classList.contains('level1-list')) {
      return 1;
    } else if (parent.classList.contains('level2-list')) {
      return 2;
    }
    return 3;
  };
  
  const newListItemData = {
    tag: 'li',
    class: `level${newElementListLevel()}__list_item list__item`,
    content: ''
  };

  const newButtonsData = [
    {
      tag: 'button',
      class: 'button button-add',
      content: '+'
    },
    {
      tag: 'button',
      class: 'button button-delete',
      content: '✕'
    },
    {
      tag: 'button',
      class: 'button button-edit',
      content: '✎'
    }
  ];
  

  const newHeadingData = {
    tag: `h${newElementListLevel() + 1}`,
    class: `level${newElementListLevel()}-list__heading list__item_text editable`,
    content: ''
  };

  const newOlData = {
    tag: 'ol',
    class: `list level${newElementListLevel()}-list`,
    content: ''
  };

  const makeElement = elementData => {
    newElement = document.createElement(elementData.tag);
    if (elementData.tag === 'li') {
      newElement.setAttribute('id', makeId());
    }
    newElement.setAttribute('class', elementData.class);
    newElement.innerHTML = elementData.content;
    if(newElement.tag === 'h2' || newElement.tag ) {
      newElement.setAttribute('contenteditable', true);
      newElement.setAttribute('placeholder', '...');
    }

    return newElement;
  };

  const newOl = !hasTagChildren(parent, 'ol') && makeElement(newOlData);
  const newListItem = makeElement(newListItemData);
  const newHeading = makeElement(newHeadingData);
  const newButtons = newButtonsData.map(buttonData => makeElement(buttonData));

  return {
    ol: !hasTagChildren(parent, 'ol') && newOl,
    li: newListItem,
    heading: newHeading,
    buttons: newButtons
  };
};

const appendNewElement = (parent, newChildren) => {
  const existingOl = [...parent.children].find(child =>
    child.classList.contains('list')
  );
  const ol = hasTagChildren(parent, 'ol') ? existingOl : newChildren.ol;
  const li = ol.appendChild(newChildren.li);
  newChildren.buttons.forEach(button => li.appendChild(button));
  li.appendChild(newChildren.heading);
  ol.appendChild(li);
  if (!hasTagChildren(parent, 'ol')) {
    parent.appendChild(ol);
  }
  setButtonsOnClickEvents();
  newChildren.heading.focus();
};

const makeContent = menuElement => {
  const newElement = document.createElement('div');
  newElement.classList.add('content');
  newElement.setAttribute('id', `${menuElement.id}_content`);
  return newElement;
}

const appendContent = content => document.querySelector('.section_content').appendChild(content);