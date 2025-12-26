import { AlgorithmModule } from "./algorithm/AlgorithmModule";
import { SimpleObjectComparator } from "./algorithm/object/SimpleObjectComparator";
import { LeftJoinObjectComparator } from "./algorithm/object/LeftJoinObjectComparator";
import { SimilarArrayComparator } from "./algorithm/array/SimilarArrayComparator";
import { SimpleArrayComparator } from "./algorithm/array/SimpleArrayComparator";
import { DefaultPrimitiveComparator } from "./algorithm/primitive/DefaultPrimitiveComparator";
import { DefaultNullComparator } from "./algorithm/nulls/DefaultNullComparator";
import { DefaultOtherComparator } from "./algorithm/other/DefaultOtherComparator";

function defaultAlgorithmModule(): AlgorithmModule {
  return new AlgorithmModule(
    new SimpleObjectComparator(),
    new SimilarArrayComparator(),
    new DefaultPrimitiveComparator(),
    new DefaultNullComparator(),
    new DefaultOtherComparator()
  );
}

function simpleAndSimpleAlgorithmModule(): AlgorithmModule {
  return new AlgorithmModule(
    new SimpleObjectComparator(),
    new SimpleArrayComparator(),
    new DefaultPrimitiveComparator(),
    new DefaultNullComparator(),
    new DefaultOtherComparator()
  );
}

function simpleAndLeftJoinAlgorithmModule(): AlgorithmModule {
  return new AlgorithmModule(
    new LeftJoinObjectComparator(),
    new SimpleArrayComparator(),
    new DefaultPrimitiveComparator(),
    new DefaultNullComparator(),
    new DefaultOtherComparator()
  );
}

function similarAndLeftJoinAlgorithmModule(): AlgorithmModule {
  return new AlgorithmModule(
    new LeftJoinObjectComparator(),
    new SimilarArrayComparator(),
    new DefaultPrimitiveComparator(),
    new DefaultNullComparator(),
    new DefaultOtherComparator()
  );
}

function similarAndSimpleAlgorithmModule(): AlgorithmModule {
  return new AlgorithmModule(
    new SimpleObjectComparator(),
    new SimilarArrayComparator(),
    new DefaultPrimitiveComparator(),
    new DefaultNullComparator(),
    new DefaultOtherComparator()
  );
}

export const AlgorithmEnum = {
  DEFAULT: { getAlgorithmModule: defaultAlgorithmModule },
  BY_INDEX: { getAlgorithmModule: simpleAndSimpleAlgorithmModule },
  BY_INDEX_LEFT_FIELDS_ONLY: { getAlgorithmModule: simpleAndLeftJoinAlgorithmModule },
  BY_SIMILARITY_LEFT_FIELDS_ONLY: { getAlgorithmModule: similarAndLeftJoinAlgorithmModule },
  BY_SIMILARITY: { getAlgorithmModule: similarAndSimpleAlgorithmModule },
} as const;

export type AlgorithmEnumType = (typeof AlgorithmEnum)[keyof typeof AlgorithmEnum];
