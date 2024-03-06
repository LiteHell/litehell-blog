---
title: 'PPTX 파일 모든 슬라이드 숨김 해제하고 PDF 변환 일괄 작업하기'
subtitle: 'Python과 LibreOffice를 이용한 pptx 일괄 처리'
author: 'LiteHell'
date: '2024-03-06T08:33:00.099Z'
category: 'Dev'
tags:
    - 'Python'
---
# 서문
이번 학기에 데이터베이스시스템 과목을 수강하게 됐다. 이 과목의 강의자료는 교재 홈페이지에서 제공하는 pptx 파일을 이용하는데, 숨김 처리된 슬라이드도 모두 활용한다. 따라서 숨겨진 슬라이드를 모두 숨김 해제해야 했다.

파일이 한두개면 그냥 직접 숨겨진 슬라이드를 숨김 해제하면 된다. 하지만 강의가 시작되는 Chapter 12이후의 파일은 약 20개 정도였다. 물론 그 pptx들을 다 강의하진 않겠지만, 한두개의 파일이 아닐 것임은 확실했다.

이걸 어떻게 하면 일괄처리할 수 있을까?

# 해결
## pptx 파일의 구조
pptx 파일은 zip 파일이다. pptx파일을 압축 프로그램을 열면 다음과 같은 구조를 볼 수 있다.

![pptx파일을 압축 프로그램 KDE Ark로 연 화면](/img/show_all_slides_of_pptx_and_convert_to_pdf_batch_operation/pptx_zip_structure.png)

`ppt/slides` 디렉토리 내의 xml 파일들이 슬라이드를 나타내는 xml 파일이다. 숨김 처리된 슬라이드의 xml 파일을 보면 다음과 같이 루트 요소의 `show` 속성이 `0`으로 설정되어 있음을 확인할 수 있다.

![숨겨진 slide를 나타내는 xml 파일의 상단](/img/show_all_slides_of_pptx_and_convert_to_pdf_batch_operation/hidden_slide_xml.png)

그렇다면 `ppt/slides` 디렉토리 내의 xml 파일의 루트 요소에서 `show` 속성만 제거하면 되지 않을까?

## Python 스크립팅
python을 이용하면 기본으로 제공되는 라이브러리만으로 간단히 해결할 수 있다.

```python
#!/bin/python3
import re
from os import listdir
from os.path import isfile, join
from zipfile import ZipFile
import xml.etree.ElementTree as ET

pptx_dir = "."
# pptx_dir 디렉토리 내에서 파일명이 .pptx로 끝나는 파일의 목록을 가져온다.
pptx_files = [f for f in listdir(pptx_dir) if isfile(join(pptx_dir, f)) and f.endswith(".pptx")]
# ppt/slides/*.xml 패턴을 검사하기 위한 정규표현식
slide_xml_filename_pattern = re.compile("ppt/slides/[^/]+\\.xml")

for pptx_file in pptx_files:
    print("Processing pptx %s " % pptx_file)
    # pptx파일을 zip 파일로 연다.
    with ZipFile(pptx_file, 'a') as zipfile:
        # ppt/slides/*.xml 형태의 파일 목록을 가져온다.
        slide_xml_filenames = [i for i in zipfile.namelist() if not slide_xml_filename_pattern.fullmatch(i) is None]
        for slide_xml_filename in slide_xml_filenames:
            print("Processing xml %s" % slide_xml_filename)
            xml = None
            # xml을 파싱한다.
            with zipfile.open(slide_xml_filename, mode = 'r') as file:
                xml = ET.parse(file)
            # 루트 요소에 show 속성이 있다면 제거한다.
            if "show" in xml.getroot().attrib:
                xml.getroot().attrib.pop("show")
            # 수정된 xml을 pptx 파일 내에 쓴다.
            with zipfile.open(slide_xml_filename, mode = 'w') as file:
                xml.write(file)
```

위 스크립트는 디렉토리내의 pptx 파일을 열고, pptx 파일 내에서 파일명이 `ppt/slides/*.xml` 형태인 파일을 xml로 파상한 뒤, 루트 요소에서 `show` 속성을 삭제하고 다시 쓰는 것을 일괄 반복하는 스크립트이다.

사용 시에는 `pptx_dir` 변수값만 필요에 따라 수정하여 쓰면 된다. 위 스크립트를 실행하면 `pptx_dir` 변수에 설정된 디렉토리 내에 있는 pptx 파일들에서 숨김 처리된 슬라이드를 모두 숨김 해제한다.

## pptx ➡️ pdf 일괄 변환
필자는 OneNote를 쓰는데 OneNote는 인쇄물 삽입을 pdf나 docx로만 해야한다. 따라서 모든 pptx를 pdf로 변환할 필요가 있다.

이건 쉽다. 그냥 [LibreOffice](https://www.libreoffice.org/) 명령어 한 줄이면 끝난다.
```bash
libreoffice --headless --convert-to pdf *.pptx
```

# 결론
이상으로 여러개의 pptx 파일에서 숨김 처리된 슬라이드를 모두 일괄 숨김 해제하고 pdf로 일괄 변환하는 방법에 대해 알아보았다.

다른 사람들에게 도움이 됐으면 좋겠다.