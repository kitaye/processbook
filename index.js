const statefulElements = document.getElementsByClassName('list__item_text');
const statefulElementsArray = [...statefulElements];
const statefulIdArray = statefulElementsArray.map(
  element => element.parentNode.id
);
const editableElements = document.getElementsByClassName('editable');
const editableElementsArray = [...editableElements];
const buttons = document.getElementsByClassName('button');
const buttonsDeleteArray = [...buttons].filter(element =>
  element.classList.contains('button-delete')
);
const buttonsAddArray = [...buttons].filter(element =>
  element.classList.contains('button-add')
);
const buttonsEditArray = [...buttons].filter(element =>
  element.classList.contains('button-edit')
);
const siblingsArray = element => [...element.parentNode.children];


const maxId = statefulIdArray.reduce(
  (acc, current) => (current > acc ? current : acc),
  0
);

const makeCounter = () => {
  let counter = maxId;
  return () => (counter += 1);
};

const getMenuElementContentId = menuElement => `${menuElement.parentNode.id}_content`;

const makeId = makeCounter();
const makeContentId = id => `${id}_content`;

const foldElement = element => {
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
  const activeMenuElementContent = document.getElementById(getMenuElementContentId(activeMenuElement));
  const currentMenuElementContent = document.getElementById(getMenuElementContentId(currentMenuElement));
  console.log('ACTIVE MENU ELEMENT CONTENT ID: ' + getMenuElementContentId(activeMenuElement));
  console.log('activemenuelement: ' + activeMenuElement);
  console.log('currentmenuelement: ' + currentMenuElement);
  console.log('currentmenuelementID: ' + currentMenuElement.parentNode.id);
  console.log('activemenuelementID: ' + activeMenuElement.id);
  console.log('ID: ' + getMenuElementContentId(currentMenuElement));
  console.log('ACTIVE ID: ' + getMenuElementContentId(activeMenuElement));

  activeMenuElementContent.classList.add('visually-hidden');
  currentMenuElementContent.classList.remove('visually-hidden');
}

const setupSidebarNavigation = () =>
  statefulElementsArray.forEach(element =>
    element.addEventListener('click', event =>
      event.detail === 1
        ? handleOnClickElement(event.target)
        : makeEditable(event.target)
    )
  );

setupSidebarNavigation();
const handleOnClickElement = element => {
  setActiveContent(element);
  setActiveMenuElement(element);
  foldElement(element);
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
  element.onkeydown = event => event.keyCode === 13 && setEditPossibility(false);
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

const makeMenuElementChild = parent => {
  const newListItemData = {
    tag: 'li',
    class: 'level__list_item list__item',
    id: makeId()
  }

  const buttonClassNames = ['button-add button', 'button-delete button', 'button-edit button'];
  
  const newButtonData = buttonClassName => ({
      tag: 'button',
      class: `button ${buttonClassName}`
  })

  const newButtonsData = buttonClassNames.map(className => newButtonData(className));

  const newElementListLevel = () => {
    if(parent.classList.contains('level1-list')) {
      return 1;
    } else if(parent.classList.contains('level2-list')) {
      return 2;
    } 
    return 3;
  }

  const newHeadingData = {
    tag: `h${newElementListLevel() + 1}`,
    class: `level${newElementListLevel()}-list__heading list__item_text editable`
  }


  const makeElement = elementData => {
    newElement = document.createElement(elementData.tag);
    if(elementData.id) {
      newElement.setAttribute('id', newElement.id);
    }
    newElement.setAttribute('class', elementData.class)
    return newElement;
  };

  const newListItem = makeElement(newListItemData);
  const newHeading = makeElement(newHeadingData);
  const newButtons = newButtonsData.map(buttonData => makeElement(buttonData));

  parent.appendChild(newListItem);
  newButtons.forEach(button => newListItem.appendChild(button));
  newListItem.appendChild(newHeading);
}
  

makeElementsEditableOnButtonClick(buttonsEditArray);
buttonsDeleteArray.forEach(button => button.onclick = () => deleteSidebarElement(event.target));
buttonsAddArray.forEach(button => button.onclick = () => makeMenuElementChild(event.target.parentNode));