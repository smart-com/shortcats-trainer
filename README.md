# Shortcuts Trainer

Проект для энтузиастов, желающих получить опыт в совместной разработке проекта.

### Порядок действий:
 1. Форкнуть исходный репозиторий (https://github.com/smart-com/shortcats-trainer).
 2. Клонировать в ЛР: git clone https://github.com/[ваш_профиль]/shortcats-trainer [folder]
 3. Создать ветку для экспериментов: git branch [new branch]
 4. Перейти в эту ветку: git checkout branch
 5. Нахимичить что-нибудь.
 6. Готовый результат запушить на свой УР: git push origin [branch]
 7. Cоздать пул реквест (на Git Hub'e, должна появится спец. кнопка).
    Пулить из своей ветки в векту исходного репозитория.
 8. Подождать, пока пул реквест одобрят и примут.

**Напоминалка #1:** перед тем, как сделать пул-реквест, нужно убедиться,
что ЛР синхронизирован с исходным https://github.com/smart-com/shortcats-trainer
Для этого нужно добавить в ЛР ссылку на исходный: git remote add [repo name] [url],
а затем выпулить из него все изменения (даже если их нет, осторожность не помешает): git pull [repo] [branch]

**Напоминалка #2:** кажется, ветки с удаленного репозитория сами по себе не переносятся ЛР,
если используется команда git pull [repo] [branch]. Как же вытянуть с удаленного репозитория нужную нам ветку?
Можно попробовать так: создать в ЛР новую ветку, перейти на нее и вытянуть в нее с УР нужную ветку.

**Полезные git-команды** (по крайней мере, которые пригодились в этом проекте), всё вместе:
 - git clone [url] [directory] - скопировать на ЛР, в указанную папку
 - git branch [new_branch] - создать ветку
 - git checkout [branch] - переключиться на ветку
 - git checkout -b [new branch] - 2 в 1: создать ветку и переключиться на нее
 - git remote add [repo name] [url] - добавить УР
 - git remote -v - показать список УР
 - git pull [repo] [branch] - выпулить изменения с УР
 - git commit --amend -m "" - перезаписать предыдущий коммит. Осторожно! Если коммит, который хотим
   перезаписать, уже отправлен в УР, то лучше не использовать.

**Сокращения и сленг:**
- УР - удаленный репозиторий
- ЛР - локальный репозиторий
- форк - копия первоначального репозитория на своем УР
- форкнуть - создать копию первоначального репозитория на своем УР
- запулить - вытянуть изменения со своего УР (другое значение: создать пул реквест в иходном проекте?)
- запушить - отправить изменения на свой УР
