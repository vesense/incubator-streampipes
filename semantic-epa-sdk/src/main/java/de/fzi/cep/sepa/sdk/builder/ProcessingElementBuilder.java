package de.fzi.cep.sepa.sdk.builder;

import de.fzi.cep.sepa.model.impl.graph.SepaDescription;
import de.fzi.cep.sepa.model.impl.output.OutputStrategy;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by riemer on 20.11.2016.
 */
public class ProcessingElementBuilder extends AbstractProcessingElementBuilder<ProcessingElementBuilder, SepaDescription> {


    private List<OutputStrategy> outputStrategies;

    private ProcessingElementBuilder(String id, String name, String description) {
        super(id, name, description, new SepaDescription());
        this.outputStrategies = new ArrayList<>();
    }

    public static ProcessingElementBuilder create(String id, String label, String description)
    {
        return new ProcessingElementBuilder(id, label, description);
    }


    public ProcessingElementBuilder outputStrategy(OutputStrategy outputStrategy) {
        this.outputStrategies.add(outputStrategy);
        return me();
    }

    @Override
    public void prepareBuild() {
        super.prepareBuild();
        this.elementDescription.setOutputStrategies(outputStrategies);
    }

    @Override
    protected ProcessingElementBuilder me() {
        return this;
    }
}
