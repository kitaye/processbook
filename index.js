const statefulElements = document.getElementsByClassName('list__item_text');
const statefulElementsArray = [... statefulElements];
const statefulIdArray = statefulElementsArray.map(element => element.parentNode.id);
const editableElements = document.getElementsByClassName('editable');
const editableElementsArray = [... editableElements];
const buttons = document.getElementsByClassName('button');
const buttonsDeleteArray = [... buttons].filter(element => element.classList.contains('button-delete'));
const buttonsAddArray = [... buttons].filter(element => element.classList.contains('button-add'));
const buttonEditArray = [... buttons].filter(element => element.classList.contains('button-edit'));

const maxId = statefulIdArray.reduce((acc, current) => current > acc ? current: acc, 0);

const makeCounter = () => {
  let counter = maxId;
  return () => counter += 1
}

const getUniqueId = makeCounter();

const foldElement = element => {
  if(element.parentNode.childElementCount === 4) {
    return;
  }
  element.classList.toggle('folded');
  element.parentNode.lastElementChild.classList.toggle('visually-hidden');
};

const setActiveElement = element => {
  const activeElement = document.querySelector('.active');
  activeElement.classList.toggle('active');
  element.classList.toggle('active');
}

const setupSidebarNavigation = () => statefulElementsArray.forEach(element => element.addEventListener('click', event => event.detail === 1? handleOnClickElement(event.target): makeEditable(event.target)));

setupSidebarNavigation();
const handleOnClickElement = element => {
  setActiveElement(element);
  foldElement(element);
}

const handleMouseOverElement = element => {
  const siblingsArray = [... element.parentNode.children];
  const buttonsArray = siblingsArray.filter(element => element.classList.contains('button'));
  buttonsArray.forEach(element => element.classList.remove('visually-hidden'));
  console.log('BUTTONS: ' + buttonsArray);
  element.addEventListener('mouseout', () => buttonsArray.forEach(element => element.classList.add('visually-hidden')));
}

statefulElementsArray.forEach(element => element.addEventListener('mouseover', event => handleMouseOverElement(event.target)));

const deleteSidebarElement = element => {
  console.log(element.parentNode);
  element.parentNode.remove();
}

buttonsDeleteArray.forEach(element => element.addEventListener('click', event => deleteSidebarElement(event.target)));

