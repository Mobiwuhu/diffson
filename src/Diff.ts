import { AlgorithmEnum, type AlgorithmEnumType } from "./AlgorithmEnum";
import { AlgorithmModule } from "./algorithm/AlgorithmModule";
import type { ArrayComparator } from "./algorithm/array/ArrayComparator";
import { SimilarArrayComparator } from "./algorithm/array/SimilarArrayComparator";
import { DefaultNullComparator } from "./algorithm/nulls/DefaultNullComparator";
import type { NullComparator } from "./algorithm/nulls/NullComparator";
import type { ObjectComparator } from "./algorithm/object/ObjectComparator";
import { SimpleObjectComparator } from "./algorithm/object/SimpleObjectComparator";
import { DefaultOtherComparator } from "./algorithm/other/DefaultOtherComparator";
import type { OtherComparator } from "./algorithm/other/OtherComparator";
import { DefaultPrimitiveComparator } from "./algorithm/primitive/DefaultPrimitiveComparator";
import type { PrimitiveComparator } from "./algorithm/primitive/PrimitiveComparator";
import type { JsonValue } from "./algorithm/types";
import { PathModule } from "./model/PathModule";
import type { Result } from "./model/Result";
import { constructResult } from "./model/ResultConvertUtil";

export class Diff {
  private algorithmEnum: AlgorithmEnumType | null = null;
  private specialPath: string[] | null = null;
  private noisePahList: string[] | null = null;
  private objectComparator: ObjectComparator | null = null;
  private arrayComparator: ArrayComparator | null = null;
  private primitiveComparator: PrimitiveComparator | null = null;
  private nullComparator: NullComparator | null = null;
  private otherComparator: OtherComparator | null = null;

  diffElement(a: JsonValue, b: JsonValue): Result[] {
    const pathModule = new PathModule(this.noisePahList, this.specialPath);
    let diffContext;

    if (this.algorithmEnum !== null) {
      diffContext = this.algorithmEnum.getAlgorithmModule().diffElement(a, b, pathModule);
    } else if (
      this.objectComparator === null &&
      this.arrayComparator === null &&
      this.primitiveComparator === null &&
      this.nullComparator === null &&
      this.otherComparator === null
    ) {
      diffContext = AlgorithmEnum.DEFAULT.getAlgorithmModule().diffElement(a, b, pathModule);
    } else {
      this.constructDefaultComparator();
      diffContext = new AlgorithmModule(
        this.objectComparator!,
        this.arrayComparator!,
        this.primitiveComparator!,
        this.nullComparator!,
        this.otherComparator!
      ).diffElement(a, b, pathModule);
    }
    return constructResult(diffContext);
  }

  diff(strA: string, strB: string): Result[] {
    return this.diffElement(JSON.parse(strA), JSON.parse(strB));
  }

  private constructDefaultComparator(): void {
    if (this.objectComparator === null) {
      this.objectComparator = this.defaultObjectComparator();
    }
    if (this.arrayComparator === null) {
      this.arrayComparator = this.defaultArrayComparator();
    }
    if (this.primitiveComparator === null) {
      this.primitiveComparator = this.defaultPrimitiveComparator();
    }
    if (this.nullComparator === null) {
      this.nullComparator = this.defaultNullComparator();
    }
    if (this.otherComparator === null) {
      this.otherComparator = this.defaultOtherComparator();
    }
  }

  private defaultObjectComparator(): ObjectComparator {
    return new SimpleObjectComparator();
  }

  private defaultArrayComparator(): ArrayComparator {
    return new SimilarArrayComparator();
  }

  private defaultPrimitiveComparator(): PrimitiveComparator {
    return new DefaultPrimitiveComparator();
  }

  private defaultNullComparator(): NullComparator {
    return new DefaultNullComparator();
  }

  private defaultOtherComparator(): OtherComparator {
    return new DefaultOtherComparator();
  }

  withAlgorithmEnum(algorithmEnum: AlgorithmEnumType | null): Diff {
    this.algorithmEnum = algorithmEnum;
    return this;
  }

  withSpecialPath(specialPath: string[] | null): Diff {
    this.specialPath = specialPath;
    return this;
  }

  withNoisePahList(noisePahList: string[] | null): Diff {
    this.noisePahList = noisePahList;
    return this;
  }

  withObjectComparator(objectComparator: ObjectComparator): Diff {
    this.objectComparator = objectComparator;
    return this;
  }

  withArrayComparator(arrayComparator: ArrayComparator): Diff {
    this.arrayComparator = arrayComparator;
    return this;
  }

  withPrimitiveAlgorithm(primitiveComparator: PrimitiveComparator): Diff {
    this.primitiveComparator = primitiveComparator;
    return this;
  }

  withNullComparator(nullComparator: NullComparator): Diff {
    this.nullComparator = nullComparator;
    return this;
  }

  withOtheComparator(otherComparator: OtherComparator): Diff {
    this.otherComparator = otherComparator;
    return this;
  }
}
