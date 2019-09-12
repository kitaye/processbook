
const statefulElements = document.getElementsByClassName('list__item_text');
const statefulArray = [].slice.call(statefulElements);
const statefulIdArray = statefulArray.map(element => element.parentNode.id);

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

const elementOnClick = element => {
  setActiveElement(element);
  foldElement(element);
}


statefulArray.forEach(element => element.addEventListener('click', event => elementOnClick(event.target)));

