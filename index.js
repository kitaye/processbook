
const statefulElements = document.getElementsByClassName('list__item_text');
const statefulElementsArray = [].slice.call(statefulElements);
const statefulIdArray = statefulElementsArray.map(element => element.parentNode.id);
const editableElements = document.getElementsByClassName('editable');
const editableElementsArray = [].slice.call(editableElements);

const maxId = statefulIdArray.reduce((acc, current) => current > acc ? current: acc, 0);

const makeCounter = () => {
  let counter = maxId + 1;
  return () => counter += 1
}

const getUniqueId = makeCounter();


const foldElement = element => {
  if(element.parentNode.childElementCount === 1) {
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

const handleOnClickElement = element => {
  setActiveElement(element);
  foldElement(element);
}

const makeEditable = element => {
  element.contentEditable = true;
  element.style.cursor = 'auto';
  element.addEventListener('blur', event => {
    event.target.contentEditable = false
    event.target.style.cursor = 'pointer';
  });
}



const setupSidebarNavigation = () => statefulElementsArray.forEach(element => element.addEventListener('click', event => event.detail === 1? handleOnClickElement(event.target): false));

const setupEditableElements = () => editableElementsArray.forEach(element => element.addEventListener('dblclick', event => makeEditable(event.target)));

setupSidebarNavigation();
setupEditableElements();