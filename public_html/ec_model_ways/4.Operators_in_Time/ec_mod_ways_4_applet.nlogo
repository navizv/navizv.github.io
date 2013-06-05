breed [countries country]
breed [nodes node]
breed [opers oper]
breed [mcs mc]

undirected-link-breed [ways way]
directed-link-breed [streams stream]
undirected-link-breed [members member]

countries-own [in-use? min-len min-neib tmpvolume name c-num p-o-t]
nodes-own [in-use? min-len min-neib tmpvolume name c-num p-o-t]
opers-own [num name stock]
mcs-own [name]

ways-own [price initprice volume initvolume curvolume avgcurvolume company]
streams-own [price initprice volume initvolume curvolume prognoz tendency]

globals [nt filename years
  ;chvolume-zagr 
  ;chvolume-delta
  ]

to save-as
  let tmp user-new-file
  if tmp != "" and tmp != false [
    set filename tmp
    export-world filename
  ]
end

to save
  ifelse filename = 0 or filename = "" or filename = false [
    save-as
  ][
    export-world filename
  ]
end

to open
  ;user-message "qq"
  let tmp user-file
  ;user-message tmp
  if tmp != "" and tmp != false [
    import-world tmp;"default.csv";
    set filename tmp
  ]
  reset-modeling
end

to set-background
  let tmp-uf user-file;"ris.png";
  if tmp-uf != false [
    clear-drawing
    ask patches [set pcolor white]
    import-drawing tmp-uf
  ]
end

to setup-mode
  if mouse-down? [
    let a-country min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
    if a-country != nobody [
      ask a-country [
        while [mouse-down?] [
          setxy mouse-xcor mouse-ycor
          display
        ]
      ]  
    ]
  ]
end

to setup-country
  ;if mode != 1 [stop]
  create-countries 1 [
    set color blue
    set shape "house"
    ;set label who
    set label-color black
    setxy mouse-xcor mouse-ycor
    display
  ]
end

to setup-mc
  ;if mode != 1 [stop]
  create-mcs 1 [
    set color red
    set shape "flag"
    ;set label who
    set label-color black
    setxy mouse-xcor mouse-ycor
    display
  ]
end

to setup-node
  ;if mode != 1 [stop]
  create-nodes 1 [
    set color pink
    set shape "circle"
    ;set label who
    set label-color black
    setxy mouse-xcor mouse-ycor
    display
  ]
end

to setup-oper
  ;if mode != 1 [stop]
  create-opers 1 [
    set color green
    set shape "truck"
    ;set label who
    set label-color black
    setxy mouse-xcor mouse-ycor
    display
  ]
end

to setup-way
  ;if mouse-down? [
    let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        create-turtles 1 [
          set shape "dot"
          setxy mouse-xcor mouse-ycor
          create-way-with ver [set color red]
          let dist distancexy mouse-xcor mouse-ycor
          let verx nobody
          while [not mouse-down?] [
            setxy mouse-xcor mouse-ycor
            let ver2 min-one-of other turtles with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
            if not((is-country? ver and is-node? ver2) or (is-country? ver2 and is-node? ver) or (is-node? ver and is-node? ver))
            [set ver2 nobody]
            ifelse ver2 != nobody [
              if verx != nobody and ver2 != verx[
                ask verx[
                 ask way-with ver [
                    die
                  ]]
                  set verx nobody
              ]
              
              if ver2 != ver and ver2 != verx[
                ask ver2 [
                  if not way-neighbor? ver[
                    create-way-with ver [
                      set label (word price "; " volume "; " company)
                      set label-color black
                      set color red
                    ]
                    set verx ver2
                  ]
                ]
              ]
              
            ][
              if verx != nobody [
                ask verx[
                 ask way-with ver [
                    die
                  ]]
                  set verx nobody
              ]
            ]
          ]
          die
        ]  
      ]
    ;]
end

to setup-member
  ;if mouse-down? [
    let ver min-one-of turtles with [breed != nodes] with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        create-turtles 1 [
          set shape "dot"
          setxy mouse-xcor mouse-ycor
          create-way-with ver [set color blue]
          let dist distancexy mouse-xcor mouse-ycor
          let verx nobody
          while [not mouse-down?] [
            setxy mouse-xcor mouse-ycor
            let ver2 min-one-of other turtles with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
            if not((is-country? ver and (is-oper? ver2 or is-mc? ver2)) or (is-country? ver2 and (is-oper? ver or is-mc? ver)) or (is-oper? ver and is-mc? ver2) or (is-oper? ver2 and is-mc? ver))
            [set ver2 nobody]
            ifelse ver2 != nobody [
              if verx != nobody and ver2 != verx[
                ask verx[
                 ask way-with ver [
                    die
                  ]]
                  set verx nobody
              ]
              
              if ver2 != ver and ver2 != verx[
                ask ver2 [
                  if not way-neighbor? ver[
                    create-way-with ver [
                      ;set label (word price "; " volume "; " company)
                      ;set label-color black
                      set color blue
                    ]
                    set verx ver2
                  ]
                ]
              ]
              
            ][
              if verx != nobody [
                ask verx[
                 ask way-with ver [
                    die
                  ]]
                  set verx nobody
              ]
            ]
          ]
          die
        ]  
      ]
    ;]
end


to-report ldistancexy [x y]
  let a2 0
  let b2 0
  let c2 0
  let tmp end2
  ask end1 [
    set a2 distancexy x y
    set c2 distance tmp
  ]
  ask end2 [set b2 distancexy x y]
  if a2 > c2 or b2 > c2 [report min list a2 b2]
  set a2 a2 * a2
  set b2 b2 * b2  
  set c2 c2 * c2
  let tmp2 c2 - a2 - b2
  let h2 (4 * a2 * b2 - tmp2 * tmp2) / (4 * c2)
  report sqrt h2
end

to delete-object
  let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
  ifelse ver != nobody [
    ask ver [
      ask my-ways [
        die
      ]
      die
    ]
  ][
    set ver min-one-of ways with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
    ifelse ver != nobody [
      ask ver [die]
    ][
      set ver min-one-of streams with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        ask ver [die]
        ;!!!!
      ]
    ]
  ]
end

to-report str-cv [str var]
  ifelse var = "" or var = false [
    report str
  ][
    report (word str "\n(Текущее значение - \"" var "\")")
  ]
end

to-report link-id [str]
  let tmp1 [name] of end1
  let tmp2 [name] of end2

  let res "("
  if tmp1 != "" and tmp1 != 0 [
    set res (word res "от \"" tmp1 "\"")
  ]
  if tmp2 != "" and tmp2 != 0 [
    if last res != "(" [
      set res (word res " ")
    ]
    set res (word res "к \"" tmp2 "\"")
  ]
  if last res = "(" [
    report str
  ]
  set res (word res ")")  
  report word str res
end

to edit-properties
  ;let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
  ;ifelse ver != nobody [][
    let ver min-one-of ways with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
    ifelse ver != nobody [
      ask ver [
        let tmps user-input str-cv link-id "Введите цену для данной дороги" price
        if tmps != ""
        [
          set price read-from-string tmps
          set initprice price
          set label (word price "; " volume "; " company)
          set label-color black
        ]
      ]
    ][
      set ver min-one-of streams with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        ask ver [
          let tmps user-input str-cv link-id "Введите цену для данного потока" price
          if tmps != ""
          [
            set price read-from-string tmps
            set initprice price
            set label (word price "; " volume "; " prognoz)
            set label-color black
          ]
        ]
      ]
    ]
  ;]
end

to edit-properties-v
  ;let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
  ;ifelse ver != nobody [][
    let ver min-one-of ways with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
    ifelse ver != nobody [
      ask ver [
        let tmps user-input str-cv link-id "Введите объём для данной дороги" volume
        if tmps != ""
        [
          set volume read-from-string tmps
          set initvolume volume
          set label (word price "; " volume "; " company)
          set label-color black
        ]
      ]
    ][
      set ver min-one-of streams with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        ask ver [
          let tmps user-input str-cv link-id "Введите объём для данного потока" volume
          if tmps != ""
          [
            set volume read-from-string tmps
            set initvolume volume
            if prognoz = 0 or prognoz = false [
              calculate-prognoz
            ]
            set label (word price "; " volume "; " prognoz)
            set label-color black
          ]
        ]
      ]
    ]
  ;]
end

to calculate-prognoz
  if tendency = 0 or tendency = false [
    set tendency 1
  ]
  set prognoz volume + tendency * 10
  set prognoz precision prognoz 2
  set label (word price "; " volume "; " prognoz)
end

to edit-future-volume
  let ver min-one-of streams with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        ask ver [
          let tmps user-input str-cv link-id "Введите прогноз объёма для данного потока" prognoz
          if tmps != ""
          [
            set prognoz read-from-string tmps
            set tendency (prognoz - volume) / 10
            set label (word price "; " volume "; " prognoz)
            set label-color black
          ]
        ]
      ]
end

to edit-company
  ;let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
  ;ifelse ver != nobody [][
    let ver min-one-of ways with [ldistancexy mouse-xcor mouse-ycor < 1] [ldistancexy mouse-xcor mouse-ycor]
    ifelse ver != nobody [
      ask ver [
        let tmps user-input str-cv link-id "Введите номер компании для данной дороги" company
        if tmps != ""
        [
          set company read-from-string tmps
          set label (word price "; " volume "; " company)
          set label-color black
        ]
      ]
    ][
      set ver min-one-of opers with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
      ifelse ver != nobody [
        ask ver [
          let tmps user-input str-cv word "Введите номер для оператора " name num
          if tmps != ""
          [
            let num-tmp read-from-string tmps
            let op-tmp one-of other opers with [num = num-tmp]
            if op-tmp != nobody[
              user-message "Опреатор с таким номером уже существует!"
              stop
            ]
            set num num-tmp
            set label (word num "; " name "; " stock)
            set label-color black
          ]
        ]
      ][
        setup-oper
      ]
    ]
  ;]
end

to edit-name
  let ver min-one-of turtles with [distancexy mouse-xcor mouse-ycor < 1] [distancexy mouse-xcor mouse-ycor]
  if ver != nobody [
    ask ver [
      let tmps ""
      if breed = countries [
        ifelse name = 0 or name = "" [
          set tmps user-input "Введите название для данной страны"
        ][
          set tmps user-input word "Введите новое название для страны " name
        ]
      ]
      if breed = nodes [
        ifelse name = 0 or name = "" [
          set tmps user-input "Введите название для данного узла"
        ][
          set tmps user-input word "Введите новое название для узла " name
        ]
      ]
      if breed = opers [
        ifelse name = 0 or name = "" [
          set tmps user-input "Введите название для данного оператора"
        ][
          set tmps user-input word "Введите новое название для оператора " name
        ]
      ]
      if breed = mcs [
        ifelse name = 0 or name = "" [
          set tmps user-input "Введите название для данной международной организации"
        ][
          set tmps user-input word "Введите новое название для международной организации " name
        ]
      ]
      
      
      if tmps != "" [
        set name tmps
      ]

      ifelse breed = opers [
        set label (word num "; " name "; " stock)
      ][
        set label name      
      ]
      set label-color black
    ]
  ]
end

to setup-stream
  let ver min-one-of countries with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
      if ver != nobody [
        create-turtles 1 [
          set shape "dot"
          setxy mouse-xcor mouse-ycor
          create-stream-from ver [set color green]
          let dist distancexy mouse-xcor mouse-ycor
          let verx nobody
          while [not mouse-down?] [
            setxy mouse-xcor mouse-ycor
            let ver2 min-one-of other countries with [distancexy mouse-xcor mouse-ycor < 2] [distancexy mouse-xcor mouse-ycor]
            ifelse ver2 != nobody [
              if verx != nobody and ver2 != verx[
                ask verx[
                 ask in-stream-from ver [
                    die
                  ]]
                  set verx nobody
              ]
              
              if ver2 != ver and ver2 != verx[
                ask ver2 [
                  if not in-stream-neighbor? ver[
                    create-stream-from ver [
                      set label (word price "; " volume "; " prognoz)
                      set label-color black
                      set color green
                    ]
                    set verx ver2
                  ]
                ]
              ]
              
            ][
              if verx != nobody [
                ask verx[
                 ask in-stream-from ver [
                    die
                  ]]
                  set verx nobody
              ]
            ]
          ]
          die
        ]  
      ]
end
;---------------------------------------------FIND WAY------------------------------

to calculate-streams
  ask turtles with [breed = nodes or breed = countries] [
    set in-use? false
    set min-len 1000000
    set label-color black
  ]
  let tmp turtles with [breed = nodes or breed = countries] with [not in-use?]
  ask ways [
    set thickness 0
    set label (word price "; " volume)
    set label-color black
    set curvolume volume
  ]
  let tmplist sort-by [[price] of ?1 > [price] of ?2] streams
  foreach tmplist [
  ask ? [
    set curvolume volume
    while [curvolume > 0][
      ask tmp [
        set in-use? false
        set min-len 1000000
        set min-neib 0
      ]
      let ver end2
      ask end1 [find-min-way-to ver]
      ask end1 [commit-way ver]
      ifelse [min-len = 1000000] of end1 [ 
        set thickness 0.5
        set curvolume 0][set thickness 0
      let minus min list [tmpvolume] of end1 curvolume
      set curvolume curvolume - minus
      ask end1 [place-stream ver minus]
      ]
    ]
  ]]
  draw-ways
end

to draw-ways
  let maxvol [volume] of max-one-of ways [volume]
  ask ways [
    set label (word price "; " volume "; " precision curvolume 2 "; " company)
    ifelse volume = 0 or curvolume = volume [
      set thickness 0
    ][
      set thickness 0.2 + 0.5 * ( volume - curvolume ) / maxvol
    ]
    ifelse curvolume = 0 [
      set color orange
    ][
      set color red
    ]
  ]
end

to commit-way [dest]
  if self = dest [
    set tmpvolume 1000000
    stop
  ]
  if min-neib != 0 [
    ask way-with min-neib [set thickness 0.5]
    ask min-neib [commit-way dest]
    set tmpvolume min list [tmpvolume] of min-neib [curvolume] of way-with min-neib
  ]
  ;show tmpvolume
end

to place-stream [dest minus]
  if self = dest [stop]
  ask way-with min-neib [set curvolume curvolume - minus]
  ask min-neib [place-stream dest minus]
end

to find-min-way-to [dest]
  if self = dest [
    set min-len 0
    set min-neib self
    set c-num 0
    stop
  ]
  
  set in-use? true
  let ver self
  let possible way-neighbors with [not in-use? and [curvolume > 0] of way-with ver]
  
  ask possible [find-min-way-to dest]

  let tmp-ver min-one-of possible [price-of-to ver]

  if tmp-ver = nobody [
    set in-use? false
    stop
  ]
  
  let tmp [p-o-t] of tmp-ver
  if tmp < min-len [
    set min-len tmp
    set min-neib tmp-ver
    
    set c-num [company] of way-with min-neib
  ]
  
  set in-use? false
end

to-report price-of-to [ver]
  let tmp min-len
  let curcompany c-num
  let cm 0
  if c-num != 0 and min-neib != 0 and [c-num] of min-neib != c-num [
    set cm [price] of way-with min-neib
  ]
  ask way-with ver [
    if tmp != 1000000 [
      ifelse company != 0 and curcompany = company [
        set tmp tmp + price * ( 1 - skidka ) ; СКИДКА!
      ][
        set tmp tmp + price
      ]
    ]
  ]
  set p-o-t tmp
  report tmp
end

to calculate-streams-avg
  let i 0
  ask ways [
    set avgcurvolume 0
  ]
  let my-end 50
  while [i < my-end][
    calculate-streams
    ask ways [
      set avgcurvolume avgcurvolume + curvolume
    ]
    set i i + 1
  ]
  ask ways [
    set curvolume avgcurvolume / my-end
  ]
  draw-ways
end

;----------------------------------------------MODELING IN TIME-----------------------------
to modeling
  calculate-streams
  ask opers with [num != 0][
    vyruchka
    chprice
    chvolume
    check-state
  ]
  chstreams
  do-plots
  tick
  if ticks mod 4 = 0 [
    set years years + 1
    if years mod 10 = 0 [
      ask streams [
        let tmp prognoz
        calculate-prognoz
        set label (word price "; " volume " (" tmp "); " prognoz)
      ]
      stop
    ]
  ]
end

to reset-modeling
  clear-all-plots
  ;import-world filename
  ask links with [breed = streams or breed = ways][
    set volume initvolume
    if breed = streams [
      calculate-prognoz
    ]
    set price initprice 
    set thickness 0
    
    ifelse breed = ways [
      set label (word price "; " volume "; " company)
      set color red
    ][
      set label (word price "; " volume "; " prognoz)
    ]
  ]
  ask opers [set stock 100]
  
  reset-ticks
  set years 0
end

to reset-modeling-parameters
  set chvolume-zagr 0.8
  set chvolume-delta 6
  set chprice-delta 1
  set chprice-low 0.2
  set vyruchka-otkl 1
  set oper-potreb 5
  set subsidy 100
end

to check-state
  set stock stock - oper-potreb
  if stock < 0 [
    
    ;let old-num num
    ;let old-way one-of ways with [company = old-num]
    ;let way-price [price * volume] of old-way
    ;let new-oper one-of other opers with [stock > way-price]
    ;if old-way != nobody and new-oper != nobody[
      ;ask old-way [set company [num] of new-oper]
      ;set stock stock + way-price
      ;ask new-oper [set stock stock - way-price]
    ;]
    set stock subsidy
  ]
end

to chstreams
  ;if ticks < 10[stop]
  ask streams [
    set volume volume + random-normal tendency chstream-otkl / 4;* (6 - random 11) / 4 ;/ 100 ;* 0.01 * volume
    set volume precision volume 2
    if volume < 0 [
      set volume 0
    ]
    set label (word price "; " volume "; " prognoz)
  ]
end

to chvolume ;izmenenie ob"yomov svoih putej
  ;if ticks < 10[stop]
  let num-tmp num
  let tmp-stock stock
  
  ask ways with [company = num-tmp] [
    let curvol-rel 1
    if volume != 0 [
      set curvol-rel 1 - curvolume / volume ; Zagruzhennost'
    ]
    if tmp-stock > 0 and curvol-rel > chvolume-zagr [
      let tmp-delta chvolume-delta * initprice; * 10;
      if tmp-stock > tmp-delta [
        set volume volume + chvolume-delta
        set tmp-stock tmp-stock - tmp-delta
      ]
    ]
  ]
  set tmp-stock stock
end

to chprice ;izmenenie cen svoih putej
  let num-tmp num
  ask ways with [company = num-tmp] [
    let curvol-rel 0
    if volume != 0 [
      set curvol-rel 1 - curvolume / volume ; Zagruzhennost'
    ]
    if curvol-rel < chprice-low [
      set price price - chprice-delta
      if price < initprice [
        set price initprice
      ]
    ]
    if curvol-rel > chprice-high [
      set price price + chprice-delta
    ]
  ]
end

to vyruchka ;vyruchka opera
  let num-tmp num
  let tkm sum [(price - initprice) * (volume - curvolume)] of ways with [company = num-tmp] ;Tonnokilometrov
  set stock stock + tkm * random-normal 1 vyruchka-otkl;* vyruchka-koeff 0.01 * (random 20)
end

to do-plots
  set-current-plot "Operators"
  if ticks = 0 [
    
    let tmplist sort-by [[num] of ?1 < [num] of ?2] opers
    foreach tmplist [
    ask ?  [
      create-temporary-plot-pen (word "(" num ") " name)
      set-current-plot-pen (word "(" num ") " name)
      set-plot-pen-color 5 + 10 * num
    ]
  ]]
  
  ask opers [
    set-current-plot-pen (word "(" num ") " name)
    plot stock
  ]  
  
  ;set-current-plot "Current-operators"
  ;set-current-plot-pen "qq"
  ;set-plot-x-range 0 count opers
  ;set-histogram-num-bars count opers
  ;histogram (list 1 2 5 2 2 2 4);[stock] of opers
end
@#$#@#$#@
GRAPHICS-WINDOW
253
10
1134
470
33
16
13.0
1
10
1
1
1
0
0
0
1
-33
33
-16
16
0
0
1
ticks

SLIDER
964
514
1136
547
skidka
skidka
0
1
0.25
0.05
1
NIL
HORIZONTAL

BUTTON
4
12
95
45
Очистить поле
clear-all\nask patches [set pcolor white]\nset filename \"\"
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
98
12
251
45
Загрузить мир
;open\nimport-world \"BRIC.csv\"\nimport-drawing \"ris.png\"
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
12
52
147
85
Режим перемещения
setup-mode
T
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
1157
518
1212
551
Страна
setup-country
NIL
1
T
OBSERVER
NIL
C
NIL
NIL

BUTTON
1158
517
1213
550
Узел
setup-node
NIL
1
T
OBSERVER
NIL
E
NIL
NIL

BUTTON
1158
516
1213
549
Дорога
setup-way
NIL
1
T
OBSERVER
NIL
L
NIL
NIL

BUTTON
1157
516
1212
549
Поток
setup-stream
NIL
1
T
OBSERVER
NIL
G
NIL
NIL

BUTTON
1157
516
1212
549
Объём
edit-properties-v
NIL
1
T
OBSERVER
NIL
J
NIL
NIL

BUTTON
1157
517
1212
550
Цена
edit-properties
NIL
1
T
OBSERVER
NIL
W
NIL
NIL

BUTTON
1157
518
1213
551
Название
edit-name
NIL
1
T
OBSERVER
NIL
Y
NIL
NIL

BUTTON
1157
519
1212
552
удалить
delete-object
NIL
1
T
OBSERVER
NIL
[
NIL
NIL

BUTTON
1157
520
1214
553
Компания
edit-company
NIL
1
T
OBSERVER
NIL
R
NIL
NIL

BUTTON
55
387
150
420
Вычислить
calculate-streams
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
1153
479
1208
512
Вычислить среднее
calculate-streams-avg
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

TEXTBOX
963
470
1133
512
Скидка при прохождении маршрутов последовательно по дорогам одной компании
11
0.0
1

BUTTON
1157
516
1212
551
Страна
setup-country
NIL
1
T
OBSERVER
NIL
С
NIL
NIL

BUTTON
1158
517
1213
550
Узел
setup-node
NIL
1
T
OBSERVER
NIL
У
NIL
NIL

BUTTON
1158
516
1213
549
Дорога
setup-way
NIL
1
T
OBSERVER
NIL
Д
NIL
NIL

BUTTON
1157
516
1212
549
Поток
setup-stream
NIL
1
T
OBSERVER
NIL
П
NIL
NIL

BUTTON
1157
516
1212
549
Объём
edit-properties-v
NIL
1
T
OBSERVER
NIL
О
NIL
NIL

BUTTON
1157
517
1212
550
Цена
edit-properties
NIL
1
T
OBSERVER
NIL
Ц
NIL
NIL

BUTTON
1157
518
1213
551
Название
edit-name
NIL
1
T
OBSERVER
NIL
Н
NIL
NIL

BUTTON
1157
519
1212
552
удалить
delete-object
NIL
1
T
OBSERVER
NIL
Х
NIL
NIL

BUTTON
1157
520
1214
553
Компания
edit-company
NIL
1
T
OBSERVER
NIL
К
NIL
NIL

BUTTON
4
230
89
263
Режим потоков
ask turtles [ifelse breed = countries [show-turtle][hide-turtle]]\nask links [ifelse breed = streams [show-link][hide-link]]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
165
266
251
299
+ потоки
ask turtles [ifelse breed = countries or breed = mcs or breed = opers [show-turtle][hide-turtle]]\nask links [ifelse breed = members or breed = streams [show-link][hide-link]]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
91
230
166
263
Режим дорог
ask turtles [ifelse breed = nodes [show-turtle][hide-turtle]]\nask links [ifelse breed = ways [show-link][hide-link]]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

PLOT
6
479
362
658
Operators
NIL
NIL
0.0
10.0
0.0
10.0
true
true
PENS
"maximum" 1.0 0 -16777216 false
"average" 1.0 0 -2674135 false

BUTTON
154
387
249
420
Пуск (10 лет)
modeling
T
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
183
349
249
382
Сброс
reset-modeling
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

SLIDER
376
526
548
559
chvolume-zagr
chvolume-zagr
0
1
0.8
0.1
1
NIL
HORIZONTAL

SLIDER
377
593
549
626
chvolume-delta
chvolume-delta
0
20
6
1
1
NIL
HORIZONTAL

TEXTBOX
370
477
586
521
Критическая величина загруженности, при превышении которой рекомендуется изменять пропускную способность 
11
0.0
1

TEXTBOX
368
562
566
589
Величина, на которую увеличивается пропускная способность дороги
11
0.0
1

SLIDER
587
498
759
531
chprice-delta
chprice-delta
0
10
1
0.2
1
NIL
HORIZONTAL

BUTTON
73
349
177
382
Сброс параметров
reset-modeling-parameters
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

SLIDER
587
560
759
593
chprice-low
chprice-low
0
1
0.2
0.05
1
NIL
HORIZONTAL

SLIDER
587
622
759
655
chprice-high
chprice-high
0
1
0.7
0.05
1
NIL
HORIZONTAL

TEXTBOX
589
469
739
497
Величина, на которую увеличивается цена дороги
11
0.0
1

TEXTBOX
588
595
774
623
Высшая критическая величина загруженности для изменения цены 
11
0.0
1

TEXTBOX
589
531
782
557
Низшая критическая величина загруженности для изменения цены
11
0.0
1

SLIDER
778
501
950
534
vyruchka-otkl
vyruchka-otkl
0
5
1
0.2
1
NIL
HORIZONTAL

SLIDER
779
558
951
591
oper-potreb
oper-potreb
0
20
5
1
1
NIL
HORIZONTAL

SLIDER
780
618
952
651
subsidy
subsidy
0
1000
100
20
1
NIL
HORIZONTAL

TEXTBOX
779
472
929
500
Стандартное отклонение выручки
11
0.0
1

TEXTBOX
780
539
930
557
Величина потребления 
11
0.0
1

TEXTBOX
780
597
930
615
Величина субсидии 
11
0.0
1

MONITOR
8
336
65
381
Года
years
17
1
11

TEXTBOX
8
92
114
204
С - страна\nУ - узел\nД - дорога\nП - поток\nК - компания\nМ - международная организация\nВ - вхождение\n
11
0.0
1

TEXTBOX
88
93
197
177
Ц - цена\nО - объём\nБ - будущий объём\nН - название\nх - удалить
11
0.0
1

BUTTON
186
129
249
162
Тест
NIL
NIL
1
T
OBSERVER
NIL
Т
NIL
NIL

BUTTON
1158
521
1213
554
Bud ob
edit-future-volume
NIL
1
T
OBSERVER
NIL
,
NIL
NIL

BUTTON
1159
520
1214
553
Будущий объём
edit-future-volume
NIL
1
T
OBSERVER
NIL
Б
NIL
NIL

BUTTON
5
265
160
299
Режим "страны и союзы"
ask turtles [ifelse breed = countries or breed = mcs or breed = opers [show-turtle][hide-turtle]]\nask links [ifelse breed = members [show-link][hide-link]]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
169
230
251
263
Полный режим
ask turtles [show-turtle]\nask links [show-link]
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL

BUTTON
1160
520
1215
554
VJ
setup-mc
NIL
1
T
OBSERVER
NIL
V
NIL
NIL

BUTTON
1159
520
1214
553
МО
setup-mc
NIL
1
T
OBSERVER
NIL
М
NIL
NIL

BUTTON
1160
521
1215
554
member
setup-member
NIL
1
T
OBSERVER
NIL
D
NIL
NIL

BUTTON
1159
521
1214
554
Вхождение
setup-member
NIL
1
T
OBSERVER
NIL
В
NIL
NIL

SLIDER
967
588
1139
621
chstream-otkl
chstream-otkl
0
5
1
0.2
1
NIL
HORIZONTAL

TEXTBOX
963
555
1113
583
Стандартное отклонение прогнозируемой тенденции
11
0.0
1

@#$#@#$#@
WHAT IS IT?
-----------
Модель развития транспортной сети, предназначенной для перевозки планируемого объёма единиц условного груза между странами и обслуживаемой несколькими операторами.


HOW IT WORKS
------------
Управление такое - при нажатии определённой клавиши на клавиатуре что-то происходит с тем местом, где сейчас находится мышь. Для того, чтоб всё это работало, надо, чтобы буква Т на кнопке "Тест" слева от карты была чёрной. Для этого надо просто щёлкнуть мышью куда-нибудь в ту белую область, не на кнопку. 

Действия при нажатии буквы (перечислены на главном окне моделирования):

С - страна - под указателем мыши создаётся страна;
У - узел - узел, "перевалочный пункт";
Д - дорога - путь, т.е. физическая связь между страной и узлом или двумя узлами (потом надо дотянуть его мышкой до какого-то объекта и щёлкнуть левой клавишей мыши, если же не надо его рисовать, то просто отвести в сторону, и щёлкнуть левой клавишей мыши);
П - поток - планируемый грузопоток (это стрелка от страны к стране, символизирует нефизическую связь между странами - кто кому сколько планирует поставлять условных единиц груза, создаётся так же, как и дорога);
К - компания - компания-оператор, обслуживающая несколько дорог. Также эту кнопку надо нажимать вблизи значка компании, чтобы задать её номер;
М - международная организация;
В - вхождение - связь между страной и оператором, или страной и международной; организацией, или оператором и международной организацией. Рисуется так же, как и дорога.

Ц - цена - для ближайших к указателю мыши дороге или потоку установить цену;
О - объём - для ближайших к указателю мыши дороге или потоку установить объём;
Б - будущий объём - для ближайшего к указателю мыши потоку установить планируемый будущий объём через 10 лет;
Н - название - для ближайшей к указателю мыши страны, международной организации или компании-оператора установить название;
х - удалить - удалить ближайший к указателю мыши объект (вершину или связь).

Если нажата кнопка "Режим перемещения", то вдобавок ко всему можно при нажатой левой клавише мыши перетаскивать объекты (страны и узлы).

Кнопки режима устанавливают, какие объекты выводить на экран, а какие скрывать.


HOW TO USE IT
-------------
Для начала нужно создать или загрузить мир - схему всех объектов и связей. При создании для каждой дороги устанавливается объём (пропускная способность), цена (себестоимость перевозки единицы груза), номер компании-оператора, обслуживающей дорогу. 
Для каждого потока устанавливается объём (величина грузопотока), будущий объём (планируемая величина грузопотока через 10 лет), цена (приоритет при рассмотрении).
Для каждого оператора устанавливается номер и название.

Можно устанавливать названия для стран, международные сообщества и связи.

Затем, по кнопке "Вычислить" ищется наиболее выгодный путь для каждого потока согласно его приоритету. По кнопке Пуск запускается моделирование на 10 условных лет (такт = квартал). На графике при этом рисуется значение денежного запаса для каждого оператора.
По кнопке "Сброс" моделирование сбрасывается на нулевой год, все изменения параметров объектов забываются.

Все динамически изменяемые параметры модели выведены на бегунки снизу от карты. По кнопке "Сброс параметров" все параметры сбрасываются, все изменения параметров модели забываются.

THINGS TO NOTICE
----------------
This section could give some ideas of things for the user to notice while running the model.


THINGS TO TRY
-------------
This section could give some ideas of things for the user to try to do (move sliders, switches, etc.) with the model.


EXTENDING THE MODEL
-------------------
This section could give some ideas of things to add or change in the procedures tab to make the model more complicated, detailed, accurate, etc.


NETLOGO FEATURES
----------------
This section could point out any especially interesting or unusual features of NetLogo that the model makes use of, particularly in the Procedures tab.  It might also point out places where workarounds were needed because of missing features.


RELATED MODELS
--------------
This section could give the names of models in the NetLogo Models Library or elsewhere which are of related interest.


CREDITS AND REFERENCES
----------------------
This section could contain a reference to the model's URL on the web if it has one, as well as any other necessary credits or references.
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250

airplane
true
0
Polygon -7500403 true true 150 0 135 15 120 60 120 105 15 165 15 195 120 180 135 240 105 270 120 285 150 270 180 285 210 270 165 240 180 180 285 195 285 165 180 105 180 60 165 15

arrow
true
0
Polygon -7500403 true true 150 0 0 150 105 150 105 293 195 293 195 150 300 150

box
false
0
Polygon -7500403 true true 150 285 285 225 285 75 150 135
Polygon -7500403 true true 150 135 15 75 150 15 285 75
Polygon -7500403 true true 15 75 15 225 150 285 150 135
Line -16777216 false 150 285 150 135
Line -16777216 false 150 135 15 75
Line -16777216 false 150 135 285 75

bug
true
0
Circle -7500403 true true 96 182 108
Circle -7500403 true true 110 127 80
Circle -7500403 true true 110 75 80
Line -7500403 true 150 100 80 30
Line -7500403 true 150 100 220 30

butterfly
true
0
Polygon -7500403 true true 150 165 209 199 225 225 225 255 195 270 165 255 150 240
Polygon -7500403 true true 150 165 89 198 75 225 75 255 105 270 135 255 150 240
Polygon -7500403 true true 139 148 100 105 55 90 25 90 10 105 10 135 25 180 40 195 85 194 139 163
Polygon -7500403 true true 162 150 200 105 245 90 275 90 290 105 290 135 275 180 260 195 215 195 162 165
Polygon -16777216 true false 150 255 135 225 120 150 135 120 150 105 165 120 180 150 165 225
Circle -16777216 true false 135 90 30
Line -16777216 false 150 105 195 60
Line -16777216 false 150 105 105 60

car
false
0
Polygon -7500403 true true 300 180 279 164 261 144 240 135 226 132 213 106 203 84 185 63 159 50 135 50 75 60 0 150 0 165 0 225 300 225 300 180
Circle -16777216 true false 180 180 90
Circle -16777216 true false 30 180 90
Polygon -16777216 true false 162 80 132 78 134 135 209 135 194 105 189 96 180 89
Circle -7500403 true true 47 195 58
Circle -7500403 true true 195 195 58

circle
false
0
Circle -7500403 true true 0 0 300

circle 2
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240

cow
false
0
Polygon -7500403 true true 200 193 197 249 179 249 177 196 166 187 140 189 93 191 78 179 72 211 49 209 48 181 37 149 25 120 25 89 45 72 103 84 179 75 198 76 252 64 272 81 293 103 285 121 255 121 242 118 224 167
Polygon -7500403 true true 73 210 86 251 62 249 48 208
Polygon -7500403 true true 25 114 16 195 9 204 23 213 25 200 39 123

cylinder
false
0
Circle -7500403 true true 0 0 300

dot
false
0
Circle -7500403 true true 90 90 120

face happy
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 255 90 239 62 213 47 191 67 179 90 203 109 218 150 225 192 218 210 203 227 181 251 194 236 217 212 240

face neutral
false
0
Circle -7500403 true true 8 7 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Rectangle -16777216 true false 60 195 240 225

face sad
false
0
Circle -7500403 true true 8 8 285
Circle -16777216 true false 60 75 60
Circle -16777216 true false 180 75 60
Polygon -16777216 true false 150 168 90 184 62 210 47 232 67 244 90 220 109 205 150 198 192 205 210 220 227 242 251 229 236 206 212 183

fish
false
0
Polygon -1 true false 44 131 21 87 15 86 0 120 15 150 0 180 13 214 20 212 45 166
Polygon -1 true false 135 195 119 235 95 218 76 210 46 204 60 165
Polygon -1 true false 75 45 83 77 71 103 86 114 166 78 135 60
Polygon -7500403 true true 30 136 151 77 226 81 280 119 292 146 292 160 287 170 270 195 195 210 151 212 30 166
Circle -16777216 true false 215 106 30

flag
false
0
Rectangle -7500403 true true 60 15 75 300
Polygon -7500403 true true 90 150 270 90 90 30
Line -7500403 true 75 135 90 135
Line -7500403 true 75 45 90 45

flower
false
0
Polygon -10899396 true false 135 120 165 165 180 210 180 240 150 300 165 300 195 240 195 195 165 135
Circle -7500403 true true 85 132 38
Circle -7500403 true true 130 147 38
Circle -7500403 true true 192 85 38
Circle -7500403 true true 85 40 38
Circle -7500403 true true 177 40 38
Circle -7500403 true true 177 132 38
Circle -7500403 true true 70 85 38
Circle -7500403 true true 130 25 38
Circle -7500403 true true 96 51 108
Circle -16777216 true false 113 68 74
Polygon -10899396 true false 189 233 219 188 249 173 279 188 234 218
Polygon -10899396 true false 180 255 150 210 105 210 75 240 135 240

house
false
0
Rectangle -7500403 true true 45 120 255 285
Rectangle -16777216 true false 120 210 180 285
Polygon -7500403 true true 15 120 150 15 285 120
Line -16777216 false 30 120 270 120

leaf
false
0
Polygon -7500403 true true 150 210 135 195 120 210 60 210 30 195 60 180 60 165 15 135 30 120 15 105 40 104 45 90 60 90 90 105 105 120 120 120 105 60 120 60 135 30 150 15 165 30 180 60 195 60 180 120 195 120 210 105 240 90 255 90 263 104 285 105 270 120 285 135 240 165 240 180 270 195 240 210 180 210 165 195
Polygon -7500403 true true 135 195 135 240 120 255 105 255 105 285 135 285 165 240 165 195

line
true
0
Line -7500403 true 150 0 150 300

line half
true
0
Line -7500403 true 150 0 150 150

pentagon
false
0
Polygon -7500403 true true 150 15 15 120 60 285 240 285 285 120

person
false
0
Circle -7500403 true true 110 5 80
Polygon -7500403 true true 105 90 120 195 90 285 105 300 135 300 150 225 165 300 195 300 210 285 180 195 195 90
Rectangle -7500403 true true 127 79 172 94
Polygon -7500403 true true 195 90 240 150 225 180 165 105
Polygon -7500403 true true 105 90 60 150 75 180 135 105

plant
false
0
Rectangle -7500403 true true 135 90 165 300
Polygon -7500403 true true 135 255 90 210 45 195 75 255 135 285
Polygon -7500403 true true 165 255 210 210 255 195 225 255 165 285
Polygon -7500403 true true 135 180 90 135 45 120 75 180 135 210
Polygon -7500403 true true 165 180 165 210 225 180 255 120 210 135
Polygon -7500403 true true 135 105 90 60 45 45 75 105 135 135
Polygon -7500403 true true 165 105 165 135 225 105 255 45 210 60
Polygon -7500403 true true 135 90 120 45 150 15 180 45 165 90

square
false
0
Rectangle -7500403 true true 30 30 270 270

square 2
false
0
Rectangle -7500403 true true 30 30 270 270
Rectangle -16777216 true false 60 60 240 240

star
false
0
Polygon -7500403 true true 151 1 185 108 298 108 207 175 242 282 151 216 59 282 94 175 3 108 116 108

target
false
0
Circle -7500403 true true 0 0 300
Circle -16777216 true false 30 30 240
Circle -7500403 true true 60 60 180
Circle -16777216 true false 90 90 120
Circle -7500403 true true 120 120 60

tree
false
0
Circle -7500403 true true 118 3 94
Rectangle -6459832 true false 120 195 180 300
Circle -7500403 true true 65 21 108
Circle -7500403 true true 116 41 127
Circle -7500403 true true 45 90 120
Circle -7500403 true true 104 74 152

triangle
false
0
Polygon -7500403 true true 150 30 15 255 285 255

triangle 2
false
0
Polygon -7500403 true true 150 30 15 255 285 255
Polygon -16777216 true false 151 99 225 223 75 224

truck
false
0
Rectangle -7500403 true true 4 45 195 187
Polygon -7500403 true true 296 193 296 150 259 134 244 104 208 104 207 194
Rectangle -1 true false 195 60 195 105
Polygon -16777216 true false 238 112 252 141 219 141 218 112
Circle -16777216 true false 234 174 42
Rectangle -7500403 true true 181 185 214 194
Circle -16777216 true false 144 174 42
Circle -16777216 true false 24 174 42
Circle -7500403 false true 24 174 42
Circle -7500403 false true 144 174 42
Circle -7500403 false true 234 174 42

turtle
true
0
Polygon -10899396 true false 215 204 240 233 246 254 228 266 215 252 193 210
Polygon -10899396 true false 195 90 225 75 245 75 260 89 269 108 261 124 240 105 225 105 210 105
Polygon -10899396 true false 105 90 75 75 55 75 40 89 31 108 39 124 60 105 75 105 90 105
Polygon -10899396 true false 132 85 134 64 107 51 108 17 150 2 192 18 192 52 169 65 172 87
Polygon -10899396 true false 85 204 60 233 54 254 72 266 85 252 107 210
Polygon -7500403 true true 119 75 179 75 209 101 224 135 220 225 175 261 128 261 81 224 74 135 88 99

wheel
false
0
Circle -7500403 true true 3 3 294
Circle -16777216 true false 30 30 240
Line -7500403 true 150 285 150 15
Line -7500403 true 15 150 285 150
Circle -7500403 true true 120 120 60
Line -7500403 true 216 40 79 269
Line -7500403 true 40 84 269 221
Line -7500403 true 40 216 269 79
Line -7500403 true 84 40 221 269

x
false
0
Polygon -7500403 true true 270 75 225 30 30 225 75 270
Polygon -7500403 true true 30 75 75 30 270 225 225 270

@#$#@#$#@
NetLogo 4.1
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
@#$#@#$#@
default
0.0
-0.2 0 0.0 1.0
0.0 1 1.0 0.0
0.2 0 0.0 1.0
link direction
true
0
Line -7500403 true 150 150 90 180
Line -7500403 true 150 150 210 180

@#$#@#$#@
0
@#$#@#$#@
