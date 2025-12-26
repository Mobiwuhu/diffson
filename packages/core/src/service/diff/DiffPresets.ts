import { UnionKeyObjectComparator } from "../comparator/object/UnionKeyObjectComparator";
import { LeftJoinObjectComparator } from "../comparator/object/LeftJoinObjectComparator";
import { SimilarArrayComparator } from "../comparator/array/SimilarArrayComparator";
import { SequentialArrayComparator } from "../comparator/array/SequentialArrayComparator";
import { DefaultPrimitiveComparator } from "../comparator/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "../comparator/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "../comparator/other/DefaultOtherComparator";
import { ComparatorOrchestrator } from "../comparator/ComparatorOrchestrator";

export const SIMILAR_COMPARE = new ComparatorOrchestrator(
  new UnionKeyObjectComparator(),
  new SimilarArrayComparator(),
  new DefaultPrimitiveComparator(),
  new DefaultNullComparator(),
  new DefaultOtherComparator()
);

export const SEQUENTIAL_COMPARE = new ComparatorOrchestrator(
  new UnionKeyObjectComparator(),
  new SequentialArrayComparator(),
  new DefaultPrimitiveComparator(),
  new DefaultNullComparator(),
  new DefaultOtherComparator()
);

export const LEFT_JOIN_SIMILAR_COMPARE = new ComparatorOrchestrator(
  new LeftJoinObjectComparator(),
  new SequentialArrayComparator(),
  new DefaultPrimitiveComparator(),
  new DefaultNullComparator(),
  new DefaultOtherComparator()
);

export const LEFT_JOIN_SEQUENTIAL_COMPARE = new ComparatorOrchestrator(
  new LeftJoinObjectComparator(),
  new SimilarArrayComparator(),
  new DefaultPrimitiveComparator(),
  new DefaultNullComparator(),
  new DefaultOtherComparator()
);

export const DEFAULT = new ComparatorOrchestrator(
  new UnionKeyObjectComparator(),
  new SimilarArrayComparator(),
  new DefaultPrimitiveComparator(),
  new DefaultNullComparator(),
  new DefaultOtherComparator()
);
