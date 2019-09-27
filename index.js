const statefulElements = document.getElementsByClassName(
    'list__item_text'
  );
  const editableElements = document.getElementsByClassName('editable');
  const buttons = document.getElementsByClassName('button');
  const hasTagChildren = (element, tag) =>
    [...element.children]
      .map(element => element.tagName.toLowerCase())
      .includes(tag);

  const siblingsArray = element => [...element.parentNode.children];

  const maxId = [...statefulElements].reduce(
    (acc, current) =>
      Number(current.parentNode.id) > acc
        ? Number(current.parentNode.id)
        : acc,
    0
  );

  const makeCounter = () => {
    let counter = maxId;
    return () => (counter = Number(counter) + 1);
  };

  const getMenuElementContentId = menuElement =>
    `${menuElement.parentNode.id}_content`;

    const getContentHeadingId = menuElement => `${menuElement.id}_heading`;

  const makeId = makeCounter();
  const makeContentId = id => `${id}_content`;

  const toggleFoldedState = element => {
    if (![...element.parentNode.children].map(( { tagName }) => tagName).includes('OL')) {
      return;
    }
    if (element.contentEditable === 'true') {
      return;
    }
    element.classList.toggle('unfolded');
    element.parentNode.querySelector('.list') &&
      element.parentNode
        .querySelector('.list')
        .classList.toggle('visually-hidden');
  };

  const setEndOfContenteditable = contentEditableElement => {
    let range;
    let selection;

    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const makeHandleClick = () => {
      let isDoubleClick = false;
      return event => {
        console.log('this')  
        console.log(event.target)
        const timer = setTimeout(() => {
              !isDoubleClick && event.detail === 1 && toggleFoldedState(event.target);
              isDouble = false;
          }, 500)
          if(event.detail === 2) {
              isDouble = true;
              clearTimeout(timer);
              editElement(event.target)
          }
      }
  }

  const handleClick = makeHandleClick();

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
    const activeMenuElement = document.querySelector(
      '.active.list__item_text'
    );
    const activeMenuElementContent =
      activeMenuElement &&
      document.getElementById(getMenuElementContentId(activeMenuElement));
    const currentMenuElementContent = document.getElementById(
      getMenuElementContentId(currentMenuElement)
    );

    activeMenuElement &&
      activeMenuElementContent.classList.add('visually-hidden');
    activeMenuElementContent &&
      currentMenuElementContent.classList.remove('visually-hidden');
  };

  const getHeadingsTree = heading => {
    const iter = (element, result) => {
        const nextListItem = element.parentNode.parentNode.closest('.list__item');
        const nextHeading = nextListItem && [...nextListItem.children].find(element => element.classList.contains('list__item_text'));
        return nextListItem ? iter(nextHeading, [...result, nextHeading]): result;
};
return iter(heading, [heading]);
  }


  const setupSidebarNavigation = () => {
    console.log([...statefulElements]);
    [...statefulElements].forEach(
      element => {
          console.log('element ' + element)
          element.addEventListener('click', event => handleOnClickElement(event));
          element.addEventListener('mouseover', () => {
              
            console.log(getHeadingsTree(event.target));
            getHeadingsTree(event.target).forEach(element => element.classList.add('hover'))
    });
        element.addEventListener('mouseout', () => getHeadingsTree(event.target).forEach(element => element.classList.remove('hover')));
      })
  }
  
    setupSidebarNavigation();

  const handleOnClickElement = event => {
    setActiveContent(event.target);
    setActiveMenuElement(event.target);
    handleClick(event);
  };

  const deleteElement = element => {
    contentId = `${element.parentNode.id}_content`;
    element.parentNode.remove();
    document.getElementById(contentId).remove();
  };

  const editElement = element => {
    const setEditPossibility = isPossible => {
      if (isPossible) {
        element.contentEditable = true;
        element.focus();
        return;
      }
      element.contentEditable = false;
    };
    setEndOfContenteditable(element);
    setEditPossibility(true);
    element.onblur = () => {
      setEditPossibility(false);
      document.getElementById(getContentHeadingId(element)).innerHTML = element.innerHTML;
    }
    element.onkeydown = event => {
      if (event.keyCode === 13) {
        setEditPossibility(false);
        console.log(getContentHeadingId(element.parentNode));
        document.getElementById(getContentHeadingId(element.parentNode)).innerHTML = element.innerHTML;
      }
    };
  };

  const makeElementsEditableOnButtonClick = buttons => {
    const editableElement = button =>
      siblingsArray(button).find(element =>
        element.classList.contains('editable')
      );
    buttons.forEach(
      button =>
        (button.onclick = event =>
          editElement(editableElement(event.target)))
    );
  };

  const setButtonsOnClickEvents = () => {
    const buttonsDeleteArray = [...buttons].filter(element =>
      element.classList.contains('button-delete')
    );
    const buttonsAddArray = [...buttons].filter(
      element =>
        element.classList.contains('button-add') ||
        element.classList.contains('button-add-child')
    );
    
    buttonsDeleteArray.forEach(
      button => (button.onclick = event => window.confirm('Вы уверены, что хотите удалить элемент?') && deleteElement(event.target))
    );

    buttonsAddArray.forEach(
      button =>
        (button.onclick = event => {
          const isAppendingChild = event.target.classList.contains('button-add-child');
          const parent = isAppendingChild
            ? event.target.parentNode
            : event.target.parentNode.parentNode.parentNode;
          const newChildren = makeMenuElement(parent);
          const heading = [...parent.children].find(element =>
            element.classList.contains('list__item_text')
          );
          appendNewElement(parent, newChildren);
          const newContent = makeContent(newChildren.li);
          appendContent(newContent);
          heading &&
            heading.classList.contains('unfolded') &&
            toggleFoldedState(heading);
          setupSidebarNavigation();
          setActiveContent(newChildren.heading);
          setActiveMenuElement(newChildren.heading);
          editElement(newChildren.heading);
        })
    );
  };

  setButtonsOnClickEvents();

  const makeMenuElement = parent => {
    const newElementListLevel = () => {
      if (parent.classList.contains('aside')) {
        return 1;
      } else if (parent.classList.contains('level1-list__item')) {
        return 2;
      }
      return 3;
    };

    const newListItemData = {
      tag: 'li',
      class: `level${newElementListLevel()}-list__item list__item`,
      content: ''
    };

    const newButtonsData = [
      {
        tag: 'button',
        class: 'button button-add removable',
        content: '+'
      },
      {
        tag: 'button',
        class: 'button button-delete removable',
        content: '–'
      },
      {
        tag: 'button',
        class: 'button button-add-child removable',
        content: '+'
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
      if (newElement.tag === 'h2' || newElement.tag) {
        newElement.setAttribute('contenteditable', true);
      }

      return newElement;
    };

    const newOl = !hasTagChildren(parent, 'ol') && makeElement(newOlData);
    const newListItem = makeElement(newListItemData);
    const newHeading = makeElement(newHeadingData);
    const newButtons = newButtonsData.map(buttonData =>
      makeElement(buttonData)
    );

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
    const heading = document.createElement('h3');
    heading.classList.add('content__heading');
    heading.setAttribute('id', getContentHeadingId(menuElement));
    console.log(heading.id);
    console.log(menuElement.id);
    newElement.appendChild(heading);
    return newElement;
  };

  const appendContent = content =>
    document.querySelector('.section_content').appendChild(content);

  const buttonEditContent = document.querySelector(
    '.section_content__button-edit'
  );

  editContent = () => {
    const visibleContent = [
      ...document.getElementsByClassName('content')
    ].find(element => !element.classList.contains('visually-hidden'));
    if (visibleContent) {
      visibleContent.contentEditable = 'true';
    }
    setEndOfContenteditable(visibleContent);
    visibleContent.focus();
    visibleContent.addEventListener(
      'onblur',
      event => (event.target.contentEditable = 'false')
    );
  };

  buttonEditContent.onclick = () => editContent();

  const linkDownloadEditable = document.querySelector(
    '.link-download-editable'
  );
  const linkDownloadLocked = document.querySelector(
    '.link-download-locked'
  );

  linkDownloadLocked.onclick = function() {
    const clone = document.querySelector('html').cloneNode(true);
    const removableElements = clone.getElementsByClassName('removable');
    [...removableElements].forEach(element => element.remove());
    this.href =
    'data: application/html;charset=utf-8,' +
      encodeURIComponent(clone.innerHTML);
  };

  linkDownloadEditable.onclick = function() {
    const clone = document.querySelector('html').cloneNode(true);
    this.href =
      'data: application/html;charset=utf-8,' +
      encodeURIComponent(clone.innerHTML);
  };

  