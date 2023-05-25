# 🌱🌱 mongoDB🌱🌱

## MongoDB 핵심개념

- 문서 지향 데이터 모델
  - 키,값이 한쌍으로 구성
  - 문자안에는 중첩된 구조를 가질 수 있다.

- 스키마 유연성
  - 각각의 문서는 자체적으로 스키마를 가지며 서로 다른 구조를 가진 문서들이 같은 컬렉션에 저장
  
- 인덱싱
  - 쿼리의 성능을 향상시키기 위해 다양한 종류의 인덱스를 지원
  
- 쿼리 언어와 집계 파이프라인
  - MongoDB는 강력한 쿼리언어를 제공
  - 다양한 연산자와 조건 사용가능하며, 집계 파이프라인을 통해 그룹화, 집계연산 수행 기능
   
 - 고가용성과 확장성
   - 분산 아키텍쳐를 기반으로 하여 고가용성과 확장성을 제공한다.
   - 데이터의 복사본을 여러 서버에 유지하여 장애 시에도 데이터의 가용성 보장, 샤딩을 통해 데이터를 여러 노드로 분산하여 처리성능 확장.
