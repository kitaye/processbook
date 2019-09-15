const statefulElements = document.getElementsByClassName('list__item_text');
const statefulElementsArray = [... statefulElements];
const statefulIdArray = statefulElementsArray.map(element => element.parentNode.id);
const editableElements = document.getElementsByClassName('editable');
const editableElementsArray = [... editableElements];
const buttons = document.getElementsByClassName('button');
const buttonsDeleteArray = [... buttons].filter(element => element.classList.contains('button-delete'));
const buttonsAddArray = [... buttons].filter(element => element.classList.contains('button-add'));
const buttonsEditArray = [... buttons].filter(element => element.classList.contains('button-edit'));
const siblingsArray = element => [... element.parentNode.children];

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

const toggleButtonsVisibilityForElement = element => {
  const buttons = [... element.parentNode.children].filter(element => element.classList.contains('button'));
  const isActive = element.classList.contains('active');
  buttons.forEach(button => isActive ? button.classList.remove('visually-hidden'): button.classList.add('visually-hidden'));
}

const setActiveElement = element => {
  const activeElement = document.querySelector('.active');
  
  activeElement && activeElement.classList.toggle('active');
  element.classList.toggle('active');
  toggleButtonsVisibilityForElement(element);
  activeElement && toggleButtonsVisibilityForElement(activeElement);
}

const setupSidebarNavigation = () => statefulElementsArray.forEach(element => element.addEventListener('click', event => event.detail === 1? handleOnClickElement(event.target): makeEditable(event.target)));

setupSidebarNavigation();
const handleOnClickElement = element => {
  setActiveElement(element);
  foldElement(element);
}

const deleteSidebarElement = element => {
  element.parentNode.remove();
}

const makeElementEditable = element => {
  const setEditPossibility = isPossible => {
    if(isPossible) {
      element.contentEditable = true;
      element.focus();
      return;
    }
    element.contentEditable = false;
    element.style.cursor = element.classList.contains('list__item_text') ? 'pointer': 'auto';
    
  }
    setEditPossibility(true);
    element.onblur = () => setEditPossibility(false);
    element.onkeydown = event => {
      if(event.keyCode === 13) {
        setEditPossibility(false);
      }
    } 
}

const makeElementsEditableOnButtonClick = buttons => {
  const editableElement = button => siblingsArray(button).find(element => element.classList.contains('editable'));
  buttons.forEach(button => button.onclick = event => {
    makeElementEditable(editableElement(event.target))
  });
}

makeElementsEditableOnButtonClick(buttonsEditArray);
buttonsDeleteArray.forEach(button => button.onclick = () => deleteSidebarElement(event.target));

